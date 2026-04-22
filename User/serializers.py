from rest_framework import serializers
from .models import User_SigUp

class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User_SigUp
        fields = '__all__'

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
