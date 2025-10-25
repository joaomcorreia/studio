from rest_framework import serializers


class OnboardingSerializer(serializers.Serializer):
    """
    Serializer for onboarding flow data.
    """
    business_name = serializers.CharField(max_length=100)
    industry_category = serializers.CharField(max_length=50, required=False, allow_blank=True)
    city = serializers.CharField(max_length=100, required=False, allow_blank=True)
    country = serializers.CharField(max_length=100, required=False, allow_blank=True)
    contact_email = serializers.EmailField()
    contact_phone = serializers.CharField(max_length=20, required=False, allow_blank=True)
    
    def validate_business_name(self, value):
        if len(value.strip()) < 2:
            raise serializers.ValidationError("Business name must be at least 2 characters long")
        return value.strip()