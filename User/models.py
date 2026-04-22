from django.db import models

# Create your models here.

class User_SigUp(models.Model):
    Name = models.CharField(max_length=100)
    Locality = models.CharField(max_length=100, default='')
    Address = models.CharField(max_length=255)
    Mobile = models.CharField(max_length=100)
    Email = models.EmailField(max_length=100)
    Username = models.CharField(max_length=100)
    Password = models.CharField(max_length=100)
    Status = models.CharField(max_length=100, default='waiting')

    def __str__(self):
        return self.Name

