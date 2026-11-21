from rest_framework import serializers
from .models import (
    Animal, 
    LiveCamera, 
    MapMarker, 
    Sponsorship, 
    ConservationStory, 
    LiveStreamSubscription,
    WildlifeWallet,
    WalletTransaction,
    WildlifeContribution,
    AnimalReaction
)

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


class LiveStreamSubscriptionSerializer(serializers.ModelSerializer):
    is_valid = serializers.BooleanField(read_only=True)

    class Meta:
        model = LiveStreamSubscription
        fields = '__all__'
        read_only_fields = ['subscription_id', 'starts_at', 'created_at']


class WildlifeWalletSerializer(serializers.ModelSerializer):
    class Meta:
        model = WildlifeWallet
        fields = ['wallet_id', 'session_id', 'user_name', 'user_email', 'balance', 'currency', 'created_at', 'updated_at']
        read_only_fields = ['wallet_id', 'created_at', 'updated_at']


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = '__all__'
        read_only_fields = ['transaction_id', 'created_at']


class WildlifeContributionSerializer(serializers.ModelSerializer):
    display_donor_name = serializers.ReadOnlyField()

    class Meta:
        model = WildlifeContribution
        fields = [
            'id', 'contribution_id', 'donor_name', 'display_donor_name', 'donor_email',
            'is_anonymous', 'amount', 'animal_slug', 'animal_name', 'animal_emoji',
            'program_description', 'personal_message', 'payment_method', 'status',
            'is_verified', 'likes_count', 'created_at'
        ]
        read_only_fields = ['contribution_id', 'is_verified', 'created_at']


class AnimalReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = AnimalReaction
        fields = ['id', 'animal_slug', 'reaction_id', 'reaction_name', 'count', 'last_updated']
        read_only_fields = ['last_updated']




