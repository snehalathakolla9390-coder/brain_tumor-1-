import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import FileSystemStorage
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User_SigUp
from .serializers import UserSignUpSerializer, UserLoginSerializer
import numpy as np
import torch
import torch.nn as nn
import torch.nn.functional as F
import cv2

# Helper function to generate JWT token manually
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegisterAPI(APIView):
    def post(self, request):
        data = request.data
        try:
            # Requirements: name, email, password, locality, address
            user = User_SigUp.objects.create(
                Name=data.get('name', ''),
                Email=data.get('email', ''),
                Password=data.get('password', ''),
                Locality=data.get('locality', ''),
                Address=data.get('address', ''),
                Username=data.get('email', ''), # Use email as username
                Mobile=data.get('mobile', '0000000000'),
                Status='active' # Automatically activate for mobile users
            )
            return Response({"message": "Account Created Successfully", "user_id": user.id}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginAPI(APIView):
    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']
            try:
                user = User_SigUp.objects.get(Email=email, Password=password)
                if user.Status == 'active':
                    tokens = get_tokens_for_user(user)
                    return Response({
                        "message": "Login successful",
                        "tokens": tokens,
                        "user": {"name": user.Name, "email": user.Email}
                    }, status=status.HTTP_200_OK)
                else:
                    return Response({"error": "You are not activated yet"}, status=status.HTTP_403_FORBIDDEN)
            except User_SigUp.DoesNotExist:
                return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserDashboardAPI(APIView):
    def get(self, request):
        # Could be authenticated using JWT
        return Response({"message": "Welcome to user dashboard", "data": "Dashboard data here"})

class PredictAPI(APIView):
    def post(self, request):
        img = request.FILES.get('img')
        if not img:
            return Response({"error": "Please select an image to upload."}, status=status.HTTP_400_BAD_REQUEST)
        
        fs = FileSystemStorage(location=settings.MEDIA_ROOT)
        filename = fs.save(img.name, img)
        image_path = os.path.join(settings.MEDIA_ROOT, filename)
        
        # Load the model
        class CNN(nn.Module):
            def __init__(self):
                super(CNN, self).__init__()
                self.cnn_model = nn.Sequential (
                    nn.Conv2d(in_channels=3, out_channels=6, kernel_size=5),
                    nn.Tanh(),
                    nn.AvgPool2d(kernel_size=2, stride=5),
                    nn.Conv2d(in_channels=6, out_channels=16, kernel_size=5),
                    nn.Tanh(),
                    nn.AvgPool2d(kernel_size=2, stride=5),
                )
                self.fc_model = nn.Sequential (
                    nn.Linear(in_features=256, out_features=120),
                    nn.Tanh(),
                    nn.Linear(in_features=120, out_features=84),
                    nn.Tanh(),
                    nn.Linear(in_features=84, out_features=1),
                )
            def forward(self, x):
                x = self.cnn_model(x)
                x = x.view(x.size(0), -1)
                x = self.fc_model(x)
                x = F.sigmoid(x)
                return x

        model = CNN()
        weights_path = os.path.join(settings.MEDIA_ROOT, 'weights', 'model.pt')
        if os.path.exists(weights_path):
            model.load_state_dict(torch.load(weights_path))
        else:
            return Response({"error": "Model weights not found. Please train model first."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        model.eval()

        image = cv2.imread(image_path)
        if image is None:
            return Response({"error": "Invalid image format"}, status=status.HTTP_400_BAD_REQUEST)

        # Image Validation Logic (MRI check)
        b_full, g_full, r_full = cv2.split(image)
        diff_bg = np.mean(np.abs(b_full.astype(int) - g_full.astype(int)))
        diff_gr = np.mean(np.abs(g_full.astype(int) - r_full.astype(int)))
        diff_rb = np.mean(np.abs(r_full.astype(int) - b_full.astype(int)))
        
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        black_pixels = np.sum(gray < 40) / gray.size
        h, w = gray.shape
        c_h, c_w = h // 10, w // 10
        corners = [
            gray[0:c_h, 0:c_w],
            gray[0:c_h, w-c_w:w],
            gray[h-c_h:h, 0:c_w],
            gray[h-c_h:h, w-c_w:w]
        ]
        avg_corners = np.mean([np.mean(c) for c in corners])

        mask = np.zeros(gray.shape, dtype=np.uint8)
        cv2.ellipse(mask, (w//2, h//2), (int(w*0.45), int(h*0.45)), 0, 0, 360, 255, -1)
        background_mask = cv2.bitwise_not(mask)
        avg_background_brightness = cv2.mean(gray, mask=background_mask)[0]

        is_mri = (diff_bg <= 12 and diff_gr <= 12 and diff_rb <= 12) and \
                 (black_pixels > 0.15) and \
                 (avg_corners < 80) and \
                 (avg_background_brightness < 80)

        if not is_mri:
            return Response({"error": "Invalid image. Please upload a valid MRI scanning image."}, status=status.HTTP_400_BAD_REQUEST)

        image_resized = cv2.resize(image, (128, 128))
        b, g, r = cv2.split(image_resized)
        image_resized = cv2.merge([r, g, b])
        image_input = image_resized.reshape(1, 3, 128, 128)
        image_input = torch.from_numpy(image_input).float() / 255.0

        def threshold(scores, threshold_val=0.5, minimum=0, maximum=1):
            x = np.array(list(scores))
            x[x >= threshold_val] = maximum
            x[x < threshold_val] = minimum
            return x

        with torch.no_grad():
            output = model(image_input)
        
        prediction = threshold(output.cpu().numpy())
        
        result_message = "Tumor detected" if prediction == 1 else "No tumor detected"
        
        return Response({
            "message": "Prediction successful",
            "prediction": int(prediction.item()),
            "result_text": result_message
        }, status=status.HTTP_200_OK)
