from rest_framework import serializers
from django.contrib.auth.models import User
from . import models
from .validators import validate_hex_color

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email')

class SubCategorySerializer(serializers.ModelSerializer):
    # category = CategorySerializer(many=False, read_only=True)

    class Meta:
        model = models.SubCategory
        fields = ['id', 'name', 'description', 'category']

class CategorySerializer(serializers.ModelSerializer):
    subcategories = SubCategorySerializer(many=True, read_only=True)

    class Meta:
        model = models.Category
        fields = ['id', 'name', 'description', 'subcategories']

class ColorsSerializer(serializers.ModelSerializer):
    code_hex = serializers.CharField(max_length=7, validators=[validate_hex_color])
    
    class Meta:
        model = models.Color
        fields = "__all__"
        
class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Size
        fields = "__all__"

    def validate_code(self, value):
        return value.upper()
    
class BrandsSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Brand
        fields = "__all__"
        read_only_fields = ['id', 'status']
    
    def validate_name(self, value):
        return value.strip().title()  # Normalize brand name to title case
    
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = "__all__"