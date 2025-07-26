from django.contrib import admin
from django.utils.html import format_html
from .models import Category, SubCategory, Color, Size, Gender, Brand, Image, Product
from .forms import ProductAdminForm

def image_preview(obj):
    if obj.image:
        return format_html('<img src="{}" width="60" height="60" style="border-radius:4px;" />', obj.image.url)
    return "-"
image_preview.short_description = 'Preview'


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'active']
    search_fields = ['name']
    list_filter = ['active']
    ordering =['name']
    fieldsets = [
        (
            "Basic Info", {
                "fields":("name", "description")
            }
        ),
        (
            "Status",{
                "fields":("active",)
            }
        ),
    ]


@admin.register(SubCategory)
class SubCategoryAdmin(admin.ModelAdmin):
    list_display = ['name','category', 'description', 'active']
    list_filter = ['category', 'active']
    search_fields = ['name', "category__name"]
    ordering = ['name']
    fieldsets = [
        (
            "Basic Info",{
                "fields":("name","category", "description")
            }
        ),
        (
            "Status",{
                "fields":("active",)
            }
        ),
    ]


@admin.register(Color)
class ColorAdmin(admin.ModelAdmin):
    list_display   = ["name", "hex_code", "rgb_code", "active", "color_block"]
    search_fields = ["name", "hex_code", "rgb_code"]
    list_filter    = ["active"]
    ordering = ["name"]

    def color_block(self, obj):
        return format_html('<div style = "width:40px; height:20px; background-color:#{0}; border:1px solid #ccc;"></div>', obj.hex_code)
        
    color_block.short_description = "Color"

    fieldsets = (
        ("Color Details", {"fields": ("name", "hex_code", "rgb_code", "description")}),
        ("Status", {"fields": ("active",)}),
    )


@admin.register(Size)
class SizeAdmin(admin.ModelAdmin):
    list_display = ["name", "size_code", "description", "active"]
    search_fields = ["name", "size_code"]
    list_filter = ["active"]
    ordering = ["name"]


@admin.register(Gender)
class GenderAdmin(admin.ModelAdmin):
    list_display = ["name", "description", "active"]
    search_fields = ("name",)
    list_filter = ("active",)


@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ["name", "origin", "active", "logo_preview"]
    list_filter  = ["active", "origin"]
    search_fields = ["name"]

    def logo_preview(self, obj):
        if obj.logo:
            return format_html('<img src="{}" style="width:50px; height:auto;" />', obj.logo.url)
        return "-"
    logo_preview.short_description = "Logo Preview"

    fieldsets = (
        ("Brand Info", {"fields": ("name", "origin", "description")}),
        ("Logo & Status", {"fields": ("logo", "active")}),
    )


class ImageInline(admin.TabularInline):
    model = Image
    extra = 1
    readonly_fields = ("image_preview",)
    fields = ("image", "image_preview", "description")

    def image_preview(self, obj):
        return image_preview(obj)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # class Media:
    #     js = ('inventory/js/product_admin.js',)

    inlines = [ImageInline]

    form = ProductAdminForm
    list_display = ['name', 'category', 'sub_category', 'active']
    list_filter = ['active', 'category', 'sub_category']
    search_fields = ['name']
    ordering = ['-created_at']

    fieldsets = (
        ("Basic Info", {"fields": ("name", "description", "active")}),
        ("Category Info", {"fields": ("category", "sub_category")}),
        ("Attributes", {"fields": ("color", "size", "gender")}),
        ("Timestamps", {"fields": ("created_at", "updated_at")}),
    )
    readonly_fields = ('created_at', 'updated_at')



@admin.register(Image)
class ImageAdmin(admin.ModelAdmin):
    list_display = ("product", image_preview, "description")
    search_fields = ("product__name",)
    readonly_fields = ("image_preview",)

    def image_preview(self, obj):
        return image_preview(obj)