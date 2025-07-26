from django.db import models


class Category(models.Model):
    name = models.CharField(max_length=30, unique=True)
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Category"
        verbose_name_plural = "Categories"


class SubCategory(models.Model):
    name = models.CharField(max_length=30)
    description = models.TextField()
    active = models.BooleanField(default=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Sub Category"
        verbose_name_plural = "Sub Categories"


class Color(models.Model):
    name = models.CharField(max_length=30, unique = True)
    hex_code = models.CharField(max_length=6, unique=True)
    rgb_code = models.CharField(
        max_length=10, unique=True, help_text="rgb color code"
    )
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Color"
        verbose_name_plural = "Colors"


class Size(models.Model):
    name = models.CharField(max_length=30, unique=True)
    size_code = models.CharField(max_length=3, unique=True)
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Size"
        verbose_name_plural = "Sizes"


class Gender(models.Model):
    name = models.CharField(max_length=10, unique=True)
    description = models.TextField()
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Gender"
        verbose_name_plural = "Genders"


BRAND_TYPE = (
    ("1", "National"),
    ("2", "International"),
    ("3", "Both")
)  
class Brand(models.Model):
    name = models.CharField(max_length=30, unique= True)
    description = models.TextField()
    origin = models.CharField(choices=BRAND_TYPE, max_length=13)
    logo = models.ImageField(upload_to="brand_logo", null=True, blank=True)
    active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Brand"
        verbose_name_plural = "Brands"


class Product(models.Model):
    name = models.CharField(max_length=50)
    description = models.TextField()
    active = models.BooleanField(default=True)

    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    sub_category = models.ForeignKey(SubCategory, on_delete=models.SET_NULL, null=True, blank=True)
    color = models.ForeignKey(Color, on_delete=models.SET_NULL, null=True, blank=True)
    size = models.ForeignKey(Size, on_delete=models.SET_NULL, null=True, blank=True)
    gender = models.ForeignKey(Gender, on_delete=models.SET_NULL, null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "Product"
        verbose_name_plural = "Products"



class Image(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="product_images")
    description = models.TextField()

    def __str__(self):
        return self.product.name

    class Meta:
        verbose_name = "Image"
        verbose_name_plural = "Images"
