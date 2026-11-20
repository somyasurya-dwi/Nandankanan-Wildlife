from django.contrib import admin
from .models import Animal, LiveCamera, MapMarker, Sponsorship, ConservationStory

@admin.register(Animal)
class AnimalAdmin(admin.ModelAdmin):
    list_display = ('name', 'scientific_name', 'category', 'conservation_status', 'featured', 'sponsorship_available')
    list_filter = ('category', 'conservation_status', 'featured')
    search_fields = ('name', 'scientific_name', 'habitat')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(LiveCamera)
class LiveCameraAdmin(admin.ModelAdmin):
    list_display = ('title', 'animal_name', 'habitat_name', 'status', 'viewer_count', 'active')
    list_filter = ('status', 'active')
    search_fields = ('title', 'animal_name', 'habitat_name')

@admin.register(MapMarker)
class MapMarkerAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'latitude', 'longitude', 'badge_text')
    list_filter = ('category',)
    search_fields = ('title', 'description')

@admin.register(Sponsorship)
class SponsorshipAdmin(admin.ModelAdmin):
    list_display = ('certificate_id', 'donor_name', 'animal', 'tier', 'amount', 'is_active', 'created_at')
    list_filter = ('tier', 'is_active')
    search_fields = ('donor_name', 'donor_email', 'certificate_id')

@admin.register(ConservationStory)
class ConservationStoryAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'author', 'published_date', 'featured')
    list_filter = ('category', 'featured')
    search_fields = ('title', 'summary')
    prepopulated_fields = {'slug': ('title',)}
