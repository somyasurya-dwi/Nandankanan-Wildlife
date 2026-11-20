from rest_framework import serializers
from .models import Animal, LiveCamera, MapMarker, Sponsorship, ConservationStory

class AnimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Animal
        fields = '__all__'

class LiveCameraSerializer(serializers.ModelSerializer):
    class Meta:
        model = LiveCamera
        fields = '__all__'

class MapMarkerSerializer(serializers.ModelSerializer):
    class Meta:
        model = MapMarker
        fields = '__all__'

class SponsorshipSerializer(serializers.ModelSerializer):
    animal_name = serializers.ReadOnlyField(source='animal.name')
    animal_photo = serializers.ReadOnlyField(source='animal.photo_url')

    class Meta:
        model = Sponsorship
        fields = '__all__'
        read_only_fields = ['certificate_id', 'created_at']

class ConservationStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ConservationStory
        fields = '__all__'

