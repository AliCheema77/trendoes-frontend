from django import forms
from .models import Product, Category
from django.core.exceptions import ValidationError

class ProductAdminForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # category = None
        # if 'category' in self.data:
        #     try:
        #         category_id = int(self.data.get('category'))
        #         category = Category.objects.get(id=category_id)
        #     except (ValueError, Category.DoesNotExist):
        #         pass
        # elif self.instance.pk:
        #     category = self.instance.category
        # if category and category.name.lower().strip() == "perfumes":
        #     self.fields['size'].widget = forms.HiddenInput()
        #     self.fields['color'].widget = forms.HiddenInput()
        #     self.fields['gender'].widget = forms.HiddenInput()

    def clean(self):
        cleaned_data = super().clean()
        category = cleaned_data.get("category")
        category_name = str(category).strip().lower() if category else ""
        if category_name == "perfumes":
            if cleaned_data.get("size"):
                self.add_error("size", "Size should not be set for perfumes.")
            if cleaned_data.get("color"):
                self.add_error("color", "Color should not be set for perfumes.")
            if cleaned_data.get("gender"):
                self.add_error("gender", "Gender should not be set for perfumes.")
        return cleaned_data
