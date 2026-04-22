from django.urls import path
from . import views, api_views

urlpatterns = [
    # Legacy web views
    path('', views.SigUp , name='userlogin') ,
    path('UserLogin/' , views.UserLogin , name='UserLogin'),
    path('User_Home/' , views.UserHome , name='UserHome'),
    path('Traning/' , views.Traning , name='Traning'),
    path('predict/' , views.predict , name='predict'),
    
    # New API views
    path('api/register/', api_views.UserRegisterAPI.as_view(), name='api_register'),
    path('api/login/', api_views.UserLoginAPI.as_view(), name='api_login'),
    path('api/predict/', api_views.PredictAPI.as_view(), name='api_predict'),
    path('api/dashboard/', api_views.UserDashboardAPI.as_view(), name='api_dashboard'),
]