from django.urls import path
from . import views, api_views

urlpatterns = [
    # Legacy web views
    path('', views.AdminLogin , name='adminlogin') , 
    path('adminhome/' , views.AdminHome , name='AdminHome'),
    path('users_view/' , views.User_View , name='User_View'),
    path('activate_user/<int:id>' , views.ActivateUser , name='ActivateUser'),
    path('Delete_User/<int:id>' , views.DeleteUser , name='DeleteUser'),
    
    # API endpoints
    path('api/login/', api_views.AdminLoginAPI.as_view(), name='admin_api_login'),
]