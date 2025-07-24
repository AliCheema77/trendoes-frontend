document.addEventListener('DOMContentLoaded', function () {
    const categoryField = document.querySelector('#id_category');
    const sizeFieldRow = document.querySelector('.form-row.field-size');
    const genderFieldRow = document.querySelector('.form-row.field-gender');
    const colorFieldRow = document.querySelector('.form-row.field-color');

    function toggleFields() {
        console.log("JS loaded");

        const selected = categoryField.options[categoryField.selectedIndex].text.toLowerCase();

        if (selected === 'perfume') {
            sizeFieldRow.style.display = 'none';
            genderFieldRow.style.display = 'none';
            colorFieldRow.style.display = 'none';
        } else {
            sizeFieldRow.style.display = '';
            genderFieldRow.style.display = '';
            colorFieldRow.style.display = '';
        }
    }

    if (categoryField) {
        categoryField.addEventListener('change', toggleFields);
        toggleFields(); // Initial call
    }
});
