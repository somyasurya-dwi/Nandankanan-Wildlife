import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'nandankanan_backend.settings')
django.setup()

from wildlife.models import Animal, LiveCamera, MapMarker, Sponsorship, ConservationStory
from django.contrib.auth.models import User

def seed():
    print("Clearing existing records...")
    Animal.objects.all().delete()
    LiveCamera.objects.all().delete()
    MapMarker.objects.all().delete()
    Sponsorship.objects.all().delete()
    ConservationStory.objects.all().delete()

    # Create admin user
    if not User.objects.filter(username='admin').exists():
        User.objects.create_superuser('admin', 'admin@nandankanan.org', 'admin123')
        print("Created superuser: admin / admin123")

    print("Seeding Animals...")
    animals_data = [
        {
            "name": "Royal Bengal Tiger",
            "slug": "royal-bengal-tiger",
            "scientific_name": "Panthera tigris tigris",
            "category": "Mammals",
            "habitat": "Tropical Moist Deciduous Forest, Riparian Thickets",
            "conservation_status": "Endangered",
            "diet": "Carnivore (Chital, Sambar, Wild Boar, Gaur)",
            "lifespan": "16 - 20 years",
            "weight_range": "180 - 260 kg",
            "short_description": "The apex predator of the Indian subcontinent, renowned for its majestic strength, camouflage stripes, and quiet grace.",
            "full_bio": "The Royal Bengal Tiger is an iconic symbol of Indian wilderness. At Nandankanan, our expansive open-air tiger safari offers these majestic cats natural forest terrain with natural water bodies. Each tiger has a unique stripe pattern like a human fingerprint. Tigers are solitary, territorial hunters and proficient swimmers who frequently bathe in Kanjia Lake's feeder streams.",
            "fun_facts": [
                "No two Bengal tigers have the exact same stripe pattern.",
                "Bengal tigers are exceptional swimmers and frequently cool down in lakes.",
                "A tiger's roar can be heard from up to 3 kilometers (nearly 2 miles) away."
            ],
            "photo_url": "/images/royal_bengal_tiger.jpg",
            "video_url": "/videos/tiger_walking_1080p.webm",
            "audio_type": "tiger",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 7500
        },
        {
            "name": "White Bengal Tiger",
            "slug": "white-bengal-tiger",
            "scientific_name": "Panthera tigris tigris (var. alba)",
            "category": "Mammals",
            "habitat": "Dense Forest Enclosures with Shaded Water Pools",
            "conservation_status": "Endangered",
            "diet": "Carnivore (Enriched lean poultry and beef rations)",
            "lifespan": "15 - 18 years",
            "weight_range": "170 - 240 kg",
            "short_description": "Nandankanan's pride and historical icon, possessing a genetic pigment variation that creates gleaming white coats and sapphire eyes.",
            "full_bio": "Nandankanan made global zoological history in 1980 when normal tawny tigers 'Deepak' and 'Ganga' naturally birthed three white tiger cubs: Debabrata, Sheeba, and Mayuri. Unlike other zoos that relied on inbred lineage, Nandankanan's white tiger strain revitalized genetic diversity. They possess striking creamy-white fur, sepia stripes, and icy blue eyes caused by a recessive gene.",
            "fun_facts": [
                "White tigers are not albinos; their coloration is caused by leucism (recessive gene expression).",
                "Nandankanan is the first zoo where white tigers were born to normal colored parents.",
                "They possess sapphire-blue eyes, unlike normal tigers who have golden or amber eyes."
            ],
            "photo_url": "/images/white_tiger.jpg",
            "video_url": "/videos/tiger_walking_pacing.webm",
            "audio_type": "tiger",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 8500
        },
        {
            "name": "Asiatic Lion",
            "slug": "asiatic-lion",
            "scientific_name": "Panthera leo persica",
            "category": "Mammals",
            "habitat": "Dry Teak Forest & Open Scrubland Enclosures",
            "conservation_status": "Endangered",
            "diet": "Carnivore (Ungulates, Buffalo meat)",
            "lifespan": "16 - 18 years",
            "weight_range": "150 - 220 kg",
            "short_description": "The proud monarch of Asian grasslands, featuring a characteristic longitudinal fold of skin along its belly.",
            "full_bio": "Slightly smaller than their African cousins, Asiatic lions are distinguished by a sparser mane that leaves their ears visible and a prominent longitudinal skin fold running along their abdomen. Nandankanan's Lion Safari allows visitors in caged safari vehicles to witness prides roaming in vast natural enclosures that mirror the Gir landscape.",
            "fun_facts": [
                "Asiatic lions have a prominent skin fold running along their belly, rarely found in African lions.",
                "Male Asiatic lion manes are shorter, showing off their ears clearly.",
                "Lions are the only cats that live in social family units called prides."
            ],
            "photo_url": "/images/asiatic_lion.jpg",
            "video_url": "/videos/lion_live.webm",
            "audio_type": "lion",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 7000
        },
        {
            "name": "Asian Elephant",
            "slug": "asian-elephant",
            "scientific_name": "Elephas maximus",
            "category": "Mammals",
            "habitat": "Moist Deciduous Forest, Riparian Grasslands",
            "conservation_status": "Endangered",
            "diet": "Herbivore (Grasses, bamboo shoots, tree bark, sugarcane, fruits)",
            "lifespan": "55 - 65 years",
            "weight_range": "2,700 - 4,500 kg",
            "short_description": "The gentle forest giant and ecosystem engineer, possessing profound intelligence and deep empathetic social bonds.",
            "full_bio": "The Asian Elephant is revered in Odisha's cultural heritage. Nandankanan is adjacent to the historic Chandaka-Dampara elephant sanctuary corridor. The park maintains a modern elephant care center with mud-wallows, bathing pools, and customized nutritional programs overseen by experienced mahouts and veterinary surgeons.",
            "fun_facts": [
                "An elephant's trunk contains over 40,000 individual muscles and no bones.",
                "Asian elephants communicate across miles using low-frequency infrasound undetectable by humans.",
                "They consume up to 150 kg of vegetation and drink over 100 liters of water daily."
            ],
            "photo_url": "/images/asian_elephant.jpg",
            "video_url": "/videos/elephant_live.webm",
            "audio_type": "elephant",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 10000
        },
        {
            "name": "Indian Pangolin",
            "slug": "indian-pangolin",
            "scientific_name": "Manis crassicaudata",
            "category": "Mammals",
            "habitat": "Sandy & Rocky Burrows, Dry Scrub Forest",
            "conservation_status": "Endangered",
            "diet": "Insectivore (Ants, termites, pupae)",
            "lifespan": "15 - 20 years",
            "weight_range": "8 - 14 kg",
            "short_description": "The enigmatic scale-armored nomad of the forest floor, conserved through Nandankanan's world-first captive breeding program.",
            "full_bio": "Nandankanan is the first and only zoological park in the world to successfully establish a captive breeding facility and protocol for the Indian Pangolin. Covered in overlapping keratin scales, this nocturnal mammal rolls into an impenetrable ball when threatened and uses its specialized 40-cm sticky tongue to consume thousands of termites each night.",
            "fun_facts": [
                "Nandankanan is the first zoo globally to record successful captive births of the Indian Pangolin.",
                "Pangolin scales are made of keratin—the exact same protein as human fingernails.",
                "A single adult pangolin consumes approximately 70 million ants and termites per year."
            ],
            "photo_url": "/images/pangolin.jpg",
            "video_url": "/videos/birds_live.webm",
            "audio_type": "birds",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 4500
        },
        {
            "name": "Gharial Crocodile",
            "slug": "gharial",
            "scientific_name": "Gavialis gangeticus",
            "category": "Reptiles",
            "habitat": "Deep Fast-Flowing River Pools, Sandbanks",
            "conservation_status": "Critically Endangered",
            "diet": "Piscivore (Fish, crustaceans)",
            "lifespan": "40 - 55 years",
            "weight_range": "150 - 250 kg",
            "short_description": "The slender-snouted crocodilian river specialist, rescued from near-extinction by Nandankanan's pioneering breeding pool.",
            "full_bio": "In 1980, the Nandankanan Gharial Breeding Project made world headlines with the historic captive hatching of gharials. The males sport a bulbous growth at the tip of their snout resembling an earthen pot ('ghara' in Odia/Hindi). Their elongated jaws lined with razor-sharp interlocking teeth are exquisitely adapted for catching fish with minimal water resistance.",
            "fun_facts": [
                "Nandankanan was the first zoo in the world where captive Gharials laid fertile eggs in 1980.",
                "Adult males have a hollow bulb called a 'ghara' on their snout used to produce resonant buzzing sounds.",
                "Gharials are physically incapable of walking upright on land and slide on their bellies."
            ],
            "photo_url": "/images/gharial.jpg",
            "video_url": "/videos/deer_live.webm",
            "audio_type": "birds",
            "featured": True,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 4000
        },
        {
            "name": "Spotted Deer (Chital)",
            "slug": "spotted-deer",
            "scientific_name": "Axis axis",
            "category": "Mammals",
            "habitat": "Open Grasslands, Secondary Deciduous Forest",
            "conservation_status": "Least Concern",
            "diet": "Herbivore (Grasses, tender shoots, fallen flowers)",
            "lifespan": "12 - 15 years",
            "weight_range": "45 - 85 kg",
            "short_description": "Graceful spotted herbivores who roam in peaceful herds, maintaining eternal mutual alarm systems with Langur monkeys.",
            "full_bio": "The spotted deer is the most common and beloved deer species in India. Their reddish-fawn coat is dotted with permanent white spots that blend seamlessly with dappled sunlight under the forest canopy. In Nandankanan's herbivore safari, herds of chital graze peacefully alongside sambar, blackbuck, and barking deer.",
            "fun_facts": [
                "Unlike most deer whose spots fade with adulthood, the Chital retains its spots for life.",
                "They share a symbiotic mutualism with Langur monkeys who drop foliage and sound predator alarms.",
                "Males shed and regrow their three-tined antlers annually."
            ],
            "photo_url": "/images/spotted_deer.jpg",
            "video_url": "/videos/deer_live.webm",
            "audio_type": "deer",
            "featured": False,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 2500
        },
        {
            "name": "Sloth Bear",
            "slug": "sloth-bear",
            "scientific_name": "Melursus ursinus",
            "category": "Mammals",
            "habitat": "Rocky Outcrops, Deciduous Forests with Termite Mounds",
            "conservation_status": "Vulnerable",
            "diet": "Myrmecophage & Frugivore (Termites, ants, honeycomb, mahua flowers)",
            "lifespan": "20 - 25 years",
            "weight_range": "80 - 140 kg",
            "short_description": "Shaggy-coated masters of rock caverns, equipped with sickle-shaped claws and a vacuum-like snout to extract termites.",
            "full_bio": "The Sloth Bear is unique among bears for specializing in insect feeding. They possess long sickle claws up to 4 inches long, lack upper middle incisors, and can close their nostrils voluntarily—creating a powerful biological vacuum cleaner that sucks termites right out of earthen mounds.",
            "fun_facts": [
                "Sloth bears can close their nostrils completely to keep angry termites out.",
                "They carry their young cubs directly on their backs, even while climbing trees or running.",
                "Their vacuum-suction eating sounds can be heard over 100 meters away."
            ],
            "photo_url": "/images/sloth_bear.jpg",
            "video_url": "",
            "audio_type": "bear",
            "featured": False,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 4500
        },
        {
            "name": "Indian Peafowl",
            "slug": "indian-peafowl",
            "scientific_name": "Pavo cristatus",
            "category": "Birds",
            "habitat": "Open Forest Glades, Riparian Orchards, Lake Shorelines",
            "conservation_status": "Least Concern",
            "diet": "Omnivore (Grains, insects, seeds, small reptiles, berries)",
            "lifespan": "15 - 20 years",
            "weight_range": "4 - 6 kg",
            "short_description": "The national bird of India, celebrated for the dazzling iridescent ocular train of the male and mesmerizing monsoon dances.",
            "full_bio": "The Indian Peafowl is one of the most stunning avian species on Earth. During the monsoon breeding season, male peacocks fan out their shimmering upper tail coverts adorned with hypnotic eye-spots ('ocelli') and vibrate their quills in a mesmerizing dance to court peahens along Kanjia Lake.",
            "fun_facts": [
                "The peacock's famous train feathers are actually upper-tail covert feathers, not the true tail.",
                "Their iridescent blues and greens are created by microscopic crystal structures that reflect light.",
                "They are celebrated in Indian folklore as vigilant sentinels against venomous snakes."
            ],
            "photo_url": "/images/indian_peafowl.jpg",
            "video_url": "/videos/birds_live.webm",
            "audio_type": "peafowl",
            "featured": False,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 2000
        },
        {
            "name": "King Cobra",
            "slug": "king-cobra",
            "scientific_name": "Ophiophagus hannah",
            "category": "Reptiles",
            "habitat": "Dense Bamboo Clumps, Moist Deciduous Forest Understory",
            "conservation_status": "Vulnerable",
            "diet": "Ophiophage (Other snakes, monitor lizards)",
            "lifespan": "18 - 22 years",
            "weight_range": "6 - 10 kg (Length: 3.5 - 4.5 m)",
            "short_description": "The world's longest venomous snake, famously bred in captivity for the first time in the world at Nandankanan.",
            "full_bio": "Nandankanan achieved another world record by successfully breeding the majestic King Cobra in captivity. Unlike all other snakes, the female King Cobra builds an elaborate nest of dried leaves for her eggs and guards them fiercely against all predators until hatching.",
            "fun_facts": [
                "Nandankanan is the first zoo on Earth to successfully breed King Cobras in captivity.",
                "It is the only snake species in the world that builds an above-ground nest for its eggs.",
                "Its scientific name 'Ophiophagus' literally translates to 'Snake Eater'."
            ],
            "photo_url": "/images/king_cobra.jpg",
            "video_url": "/videos/tiger_walking_1080p.webm",
            "audio_type": "birds",
            "featured": False,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 3500
        },
        {
            "name": "Indian Flapshell Turtle",
            "slug": "indian-flapshell-turtle",
            "scientific_name": "Lissemys punctata",
            "category": "Aquatic Animals",
            "habitat": "Freshwater Lakes, Ponds, Slow-Moving Feeder Canals",
            "conservation_status": "Least Concern",
            "diet": "Omnivore (Aquatic weeds, molluscs, small fish, frogs)",
            "lifespan": "25 - 35 years",
            "weight_range": "2.5 - 5 kg",
            "short_description": "Softshell aquatic master of Kanjia Lake wetlands, equipped with femoral flaps that conceal retracted limbs.",
            "full_bio": "Kanjia Lake inside Nandankanan provides a vital natural sanctuary for the Indian Flapshell Turtle. Named after the distinctive cutaneous flaps on the plastron that cover the hind legs when retracted, these peaceful reptiles play a crucial ecological role as scavengers, purifying lake waters.",
            "fun_facts": [
                "They can survive seasonal dry spells by burrowing deep into muddy lake bottoms during estivation.",
                "They possess leather-like soft carapaces rather than hard bony scutes.",
                "Crucial bio-indicators for the health of freshwater wetlands in Odisha."
            ],
            "photo_url": "/images/freshwater_turtle.jpg",
            "video_url": "/videos/birds_live.webm",
            "audio_type": "birds",
            "featured": False,
            "sponsorship_available": True,
            "monthly_sponsorship_cost": 1500
        }
    ]

    animal_objs = {}
    for a in animals_data:
        obj = Animal.objects.create(**a)
        animal_objs[a['slug']] = obj
    print(f"Created {len(animal_objs)} animals.")

    print("Seeding Live Cameras...")
    cameras_data = [
        {
            "title": "Royal Bengal Tiger Feed #1",
            "animal_name": "Royal Bengal Tiger",
            "habitat_name": "Dense Deciduous Forest Enclosure",
            "stream_url": "/videos/tiger_walking_1080p.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 2840,
            "thumbnail_url": "/images/royal_bengal_tiger.jpg",
            "description": "High-definition camera observing Bengal tigers near the natural forest stream and shade trees.",
            "camera_location": "Tiger Safari Observation Post",
            "order": 1
        },
        {
            "title": "Asiatic Lion Safari Cam",
            "animal_name": "Asiatic Lion",
            "habitat_name": "Dry Scrub Grassland Safari Zone",
            "stream_url": "/videos/lion_live.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 1915,
            "thumbnail_url": "/images/asiatic_lion.jpg",
            "description": "Panoramic wide lens streaming the resident lion pride basking under the afternoon sunshine.",
            "camera_location": "Lion Safari Ridge Tower",
            "order": 2
        },
        {
            "title": "Asian Elephant Meadow",
            "animal_name": "Elephant",
            "habitat_name": "Chandaka Corridor Elephant Yard",
            "stream_url": "/videos/elephant_live.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 1340,
            "thumbnail_url": "/images/asian_elephant.jpg",
            "description": "Live view of elephant family foraging on fresh bamboo stalks and bathing in water troughs.",
            "camera_location": "Elephant Shed North Deck",
            "order": 3
        },
        {
            "title": "Spotted Deer Sanctuary",
            "animal_name": "Deer",
            "habitat_name": "Herbivore Meadow & Dappled Woodland",
            "stream_url": "/videos/deer_live.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 890,
            "thumbnail_url": "/images/spotted_deer.jpg",
            "description": "Herd of spotted deer resting in dappled forest glades and interacting peacefully.",
            "camera_location": "Herbivore Safari Sector 2",
            "order": 4
        },
        {
            "title": "White Bengal Tiger Haven",
            "animal_name": "White Bengal Tiger",
            "habitat_name": "Heritage Water Pool & Sal Canopy",
            "stream_url": "/videos/tiger_safari.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 2450,
            "thumbnail_url": "/images/white_tiger.jpg",
            "description": "Observation of Nandankanan's iconic white tigers exploring shady grove channels.",
            "camera_location": "White Tiger Sector A",
            "order": 5
        },
        {
            "title": "Kanjia Lake Bird Sanctuary",
            "animal_name": "Birds",
            "habitat_name": "Wetland Aviary & Wetland Lagoon",
            "stream_url": "/videos/birds_live.webm",
            "video_type": "demo_video",
            "status": "LIVE",
            "viewer_count": 1420,
            "thumbnail_url": "/images/indian_peafowl.jpg",
            "description": "Vibrant aviary stream highlighting Indian peacocks, migratory teal, and painted storks.",
            "camera_location": "Walk-Through Aviary Dome",
            "order": 6
        }
    ]

    for c in cameras_data:
        LiveCamera.objects.create(**c)
    print("Created 6 live cameras.")

    print("Seeding Map Markers with Real Animal Enclosure Coordinates & Photos...")
    markers_data = [
        {
            "title": "Royal Bengal Tiger Safari",
            "animal_name": "Royal Bengal Tiger",
            "category": "safari_zone",
            "latitude": 20.4080,
            "longitude": 85.8160,
            "map_x": 245,
            "map_y": 151,
            "description": "Sprawling forested safari sanctuary where royal Bengal tigers roam freely through natural Sal trees and streams.",
            "badge_text": "Apex Predator Zone",
            "emoji": "🐅",
            "photo_url": "/images/royal_bengal_tiger.jpg",
            "animal_slug": "royal-bengal-tiger",
            "stream_url": "/videos/tiger_walking_1080p.webm",
            "camera_id": 1,
            "surrounding_place": "Directly connected to the Tiger Safari forest corridor with natural moats, watering streams, and adjacent to the White Tiger sanctuary.",
            "nearby_landmarks": "White Tiger Habitat, Lion Safari, and Garden Square walking trail."
        },
        {
            "title": "White Tiger Heritage Habitat",
            "animal_name": "White Bengal Tiger",
            "category": "animal_habitat",
            "latitude": 20.4030,
            "longitude": 85.8185,
            "map_x": 305,
            "map_y": 151,
            "description": "World-famous heritage enclosure preserving Nandankanan's historic white tiger lineage with shaded pools.",
            "badge_text": "World Heritage Habitat",
            "emoji": "🐅",
            "photo_url": "/images/white_tiger.jpg",
            "animal_slug": "white-bengal-tiger",
            "stream_url": "/videos/tiger_walking_pacing.webm",
            "camera_id": 1,
            "surrounding_place": "Historic breeding grove nestled within the Tiger Safari sector, equipped with shaded resting platforms and freshwater plunge pools.",
            "nearby_landmarks": "Royal Bengal Tiger enclosure, Garden Square, and Main Road walkway."
        },
        {
            "title": "Asiatic Lion Safari",
            "animal_name": "Asiatic Lion",
            "category": "safari_zone",
            "latitude": 20.4110,
            "longitude": 85.8115,
            "map_x": 105,
            "map_y": 246,
            "description": "Open grassland and dry deciduous ridge where prides of Asiatic lions bask and socialize naturally.",
            "badge_text": "Open Safari Territory",
            "emoji": "🦁",
            "photo_url": "/images/asiatic_lion.jpg",
            "animal_slug": "asiatic-lion",
            "stream_url": "/videos/lion_live.webm",
            "camera_id": 2,
            "surrounding_place": "Expansive rocky promontory and scrub savanna enclosure mirroring the Gir forest biotope.",
            "nearby_landmarks": "Herbivore Safari, Bear Safari, and Garden Square trail intersection."
        },
        {
            "title": "Asian Elephant Sanctuary",
            "animal_name": "Asian Elephant",
            "category": "animal_habitat",
            "latitude": 20.3980,
            "longitude": 85.8130,
            "map_x": 575,
            "map_y": 151,
            "description": "Expansive elephant habitat equipped with mud wallows, enrichment stations, and dedicated mahout care.",
            "badge_text": "Forest Giants Center",
            "emoji": "🐘",
            "photo_url": "/images/asian_elephant.jpg",
            "animal_slug": "asian-elephant",
            "stream_url": "/videos/elephant_live.webm",
            "camera_id": 3,
            "surrounding_place": "Lush southern forest meadow featuring natural bathing pools, mud wallows, and feeding corrals.",
            "nearby_landmarks": "Crocodile lake, Nandankanan Conservation Breeding Centre, and Central Walkway."
        },
        {
            "title": "Sloth Bear Cavern & Safari",
            "animal_name": "Sloth Bear",
            "category": "safari_zone",
            "latitude": 20.4055,
            "longitude": 85.8105,
            "map_x": 215,
            "map_y": 406,
            "description": "Natural rocky outcrops, boulders, and termite mounds for the shaggy sloth bears to forage and climb.",
            "badge_text": "Rock Escarpment Safari",
            "emoji": "🐻",
            "photo_url": "/images/sloth_bear.jpg",
            "animal_slug": "sloth-bear",
            "stream_url": "/videos/bear_live.webm",
            "camera_id": 5,
            "surrounding_place": "Rugged granite rock boulders, shaded cavern dens, and earthen mounds.",
            "nearby_landmarks": "Herbivore Safari, Nocturnal Animal House, and Safari Monorail / Ropeway."
        },
        {
            "title": "Spotted Deer Herbivore Safari",
            "animal_name": "Spotted Deer",
            "category": "safari_zone",
            "latitude": 20.4045,
            "longitude": 85.8145,
            "map_x": 100,
            "map_y": 415,
            "description": "Peaceful woodland glades where herds of Chital deer graze alongside sambar and blackbuck.",
            "badge_text": "Herbivore Meadow",
            "emoji": "🦌",
            "photo_url": "/images/spotted_deer.jpg",
            "animal_slug": "spotted-deer",
            "stream_url": "/videos/deer_live.webm",
            "camera_id": 4,
            "surrounding_place": "Expansive northern savannah glades with dappled Sal woodland canopy and watering ponds.",
            "nearby_landmarks": "Bear Safari, Asiatic Lion Safari, and Northern Periphery Road."
        },
        {
            "title": "Crocodile & Gharial Sanctuary",
            "animal_name": "Crocodile",
            "category": "animal_habitat",
            "latitude": 20.4015,
            "longitude": 85.8270,
            "map_x": 545,
            "map_y": 261,
            "description": "The world's premier captive breeding research facility for critically endangered Gharials along Kanjia Lake.",
            "badge_text": "Global Breeding Landmark",
            "emoji": "🐊",
            "photo_url": "/images/gharial.jpg",
            "animal_slug": "gharial",
            "stream_url": "/videos/deer_live.webm",
            "camera_id": 4,
            "surrounding_place": "Natural spring-fed freshwater lagoon with sandbanks and viewing bridges.",
            "nearby_landmarks": "Reptile House, Asian Elephant Sanctuary, and Toy Train Line."
        },
        {
            "title": "Indian Pangolin Research Center",
            "animal_name": "Indian Pangolin",
            "category": "animal_habitat",
            "latitude": 20.4035,
            "longitude": 85.8220,
            "map_x": 285,
            "map_y": 416,
            "description": "World-first dedicated scientific facility for breeding and rehabilitating endangered Indian pangolins.",
            "badge_text": "Nocturnal Wildlife House",
            "emoji": "🛡️",
            "photo_url": "/images/pangolin.jpg",
            "animal_slug": "indian-pangolin",
            "stream_url": "/videos/bear_live.webm",
            "camera_id": 5,
            "surrounding_place": "State-of-the-art climate-controlled subterranean nocturnal dome with inverted red-light cycles.",
            "nearby_landmarks": "Bear Safari, Safari Monorail / Ropeway, and Garden Square."
        },
        {
            "title": "Water Bird Aviary & Peafowl",
            "animal_name": "Water Bird Aviary",
            "category": "animal_habitat",
            "latitude": 20.3995,
            "longitude": 85.8220,
            "map_x": 735,
            "map_y": 366,
            "description": "Lush walk-through domed aviary hosting Indian peacocks, storks, egrets, and migratory waterbirds.",
            "badge_text": "Avian Canopy Dome",
            "emoji": "🦚",
            "photo_url": "/images/indian_peafowl.jpg",
            "animal_slug": "indian-peafowl",
            "stream_url": "/videos/birds_live.webm",
            "camera_id": 6,
            "surrounding_place": "Magnificent geodesic flight domes on the western peninsula of Kanjia Lake.",
            "nearby_landmarks": "Aviary, Kanjia Lake Boat Ghat, and Office Interpretation Centre."
        },
        {
            "title": "Reptile Park & King Cobra House",
            "animal_name": "King Cobra & Reptiles",
            "category": "animal_habitat",
            "latitude": 20.4005,
            "longitude": 85.8175,
            "map_x": 570,
            "map_y": 311,
            "description": "Houses King Cobras, Indian rock pythons, and monitor lizards in climate-regulated bio-terrariums.",
            "badge_text": "Reptile Sanctuary",
            "emoji": "🐍",
            "photo_url": "/images/king_cobra.jpg",
            "animal_slug": "king-cobra",
            "stream_url": "/videos/tiger_walking_1080p.webm",
            "camera_id": 1,
            "surrounding_place": "Central landscaped reptile garden and indoor glass-fronted terrarium chambers.",
            "nearby_landmarks": "Crocodile Pond, Central Avenue, and Garden Square."
        },
        {
            "title": "Lake Kanjia Boating & Wetland",
            "animal_name": "Kanjia Lake",
            "category": "water_body",
            "latitude": 20.3965,
            "longitude": 85.8295,
            "map_x": 680,
            "map_y": 471,
            "description": "66-hectare natural freshwater wetland of national importance, home to softshell turtles and aquatic wildlife.",
            "badge_text": "National Wetland Sanctuary",
            "emoji": "🚣",
            "photo_url": "/images/kanjia_lake.jpg",
            "animal_slug": "indian-flapshell-turtle",
            "stream_url": "/videos/birds_live.webm",
            "camera_id": 6,
            "surrounding_place": "Scenic open waters, lotus beds, and shoreline Boat Ghat with paddle and motor boat landings.",
            "nearby_landmarks": "Boat Ghat, Forest Rest House, and Aerial Ropeway crossing."
        },
        {
            "title": "Office Interpretation & Conservation Centre",
            "animal_name": "Interpretation Centre",
            "category": "visitor_facility",
            "latitude": 20.3935,
            "longitude": 85.8235,
            "map_x": 835,
            "map_y": 386,
            "description": "Main entrance ticketing plaza, administrative office, and visitor information desk.",
            "badge_text": "Conservation & Education",
            "emoji": "🏛️",
            "photo_url": "/images/sanctuary_forest.jpg",
            "animal_slug": "",
            "surrounding_place": "Spacious landscaped administrative courtyard with interpretive displays, rest facilities, and orientation desks.",
            "nearby_landmarks": "Water Bird Aviary, Forest Rest House, and Children Park."
        },
        {
            "title": "Scenic Toy Train Safari",
            "animal_name": "Toy Train",
            "category": "visitor_facility",
            "latitude": 20.3955,
            "longitude": 85.8185,
            "map_x": 420,
            "map_y": 346,
            "description": "Scenic 2.5-km eco-friendly toy train journey circling the botanical gardens and animal exhibits.",
            "badge_text": "Scenic Train Ride",
            "emoji": "🚂",
            "photo_url": "/images/sanctuary_forest.jpg",
            "animal_slug": "",
            "surrounding_place": "Dedicated railway tracks traversing the central park heartland with boarding platforms.",
            "nearby_landmarks": "Safari Monorail, Garden Square, and Central Promenade."
        },
        {
            "title": "Safari Monorail & Aerial Ropeway",
            "animal_name": "Monorail & Ropeway",
            "category": "visitor_facility",
            "latitude": 20.3995,
            "longitude": 85.8205,
            "map_x": 430,
            "map_y": 406,
            "description": "Spectacular aerial passenger cableway crossing scenic Kanjia Lake with panoramic forest canopy vistas.",
            "badge_text": "Aerial Lake Crossing",
            "emoji": "🚡",
            "photo_url": "/images/kanjia_lake.jpg",
            "animal_slug": "",
            "stream_url": "/videos/birds_live.webm",
            "camera_id": 6,
            "surrounding_place": "Elevated station tower commanding 360-degree panoramic vistas of the safari hills and lake.",
            "nearby_landmarks": "Toy Train, Bear Safari, and Kanjia Lake shores."
        },
        {
            "title": "Nandankanan Conservation Breeding Centre",
            "animal_name": "Breeding Centre",
            "category": "visitor_facility",
            "latitude": 20.3950,
            "longitude": 85.8220,
            "map_x": 710,
            "map_y": 136,
            "description": "Renowned breeding and scientific research facility dedicated to preserving endangered wildlife species.",
            "badge_text": "Scientific Research",
            "emoji": "🔬",
            "photo_url": "/images/sanctuary_forest.jpg",
            "animal_slug": "",
            "surrounding_place": "Protected sanctuary facility dedicated to scientific captive breeding, veterinary research, and species reintroduction.",
            "nearby_landmarks": "Elephant Safari, Parking Plaza, and South Entrance corridor."
        }
    ]

    for m in markers_data:
        MapMarker.objects.create(**m)
    print(f"Created {len(markers_data)} map markers with animal photos & coordinates.")

    print("Seeding Conservation Stories...")
    stories_data = [
        {
            "title": "The White Tiger Miracle: Nandankanan's Historic Legacy",
            "slug": "white-tiger-miracle",
            "category": "Breeding Breakthrough",
            "cover_image": "/images/white_tiger.jpg",
            "author": "Dr. S. K. Patnaik, Former Chief Wildlife Warden",
            "read_time": "5 min read",
            "summary": "How a historic birth in 1980 placed Nandankanan on the world zoological map and shattered scientific myths about white tiger genetics.",
            "content": """On July 28, 1980, the biological world was astonished by news from Nandankanan Zoological Park in Odisha. A pair of normal colored, tawny Royal Bengal Tigers named 'Deepak' and 'Ganga' gave birth to a litter of three white tiger cubs: Debabrata, Sheeba, and Mayuri.

Prior to this momentous event, all captive white tigers in India were descended exclusively from 'Mohan', a solitary white tiger cub captured in Rewa, Madhya Pradesh in 1951. Because subsequent white tigers were produced through repeated father-daughter or sibling matings, the Rewa lineage suffered severe genetic depression.

Nandankanan proved that the recessive white gene was naturally preserved within wild populations of Odisha's forests. Today, Nandankanan is celebrated as a cradle of tiger conservation, with generations of healthy, vigorous white tigers flourishing in expansive forest enclosures.""",
            "featured": True
        },
        {
            "title": "Rescuing the River Sovereign: The Kanjia Gharial Breeding Project",
            "slug": "gharial-captive-breeding",
            "category": "Species Recovery",
            "cover_image": "/images/gharial.jpg",
            "author": "Nandankanan Herpetological Research Wing",
            "read_time": "4 min read",
            "summary": "Establishing the world's first captive breeding pool to rescue India's fish-eating river giant from the brink of total extinction.",
            "content": """By the mid-1970s, wild Gharial (*Gavialis gangeticus*) populations in India had collapsed to fewer than 200 breeding adults due to rampant river damming, sand mining, and entangling gill nets.

In collaboration with the Government of Odisha and the UNDP/FAO, Nandankanan established a specialized Gharial breeding and rearing facility in 1980 right on the banks of Kanjia Lake. Biologists recreated natural sandy basking ramps and fast-circulating deep river pools.

Within months, the park achieved the world's first captive breeding of Gharials. Hundreds of healthy juveniles have since been head-started and rehabilitated back into the Mahanadi River and Satkosia Gorge sanctuary, creating a global benchmark in crocodilian conservation biology.""",
            "featured": True
        },
        {
            "title": "Guardians of the Scaled Nomad: The Indian Pangolin Center",
            "slug": "pangolin-conservation",
            "category": "Species Recovery",
            "cover_image": "/images/pangolin.jpg",
            "author": "Field Biologist Ananya Rath",
            "read_time": "4 min read",
            "summary": "Unraveling the mystery of the world's most heavily trafficked mammal through breakthrough behavioral research.",
            "content": """Pangolins are shy, nocturnal, burrowing mammals covered in protective keratin armor. Because they feed strictly on live ants and termites and are extremely prone to capture stress, zoological institutions worldwide historically struggled to keep pangolins alive, let alone breed them.

Nandankanan designed a dedicated Pangolin Conservation and Breeding Centre nestled in quiet, forested outskirts away from general visitor noise. Biologists engineered subterranean climate-controlled burrows, nocturnal red lighting, and formulated specialized insectivorous diets rich in natural formic acid.

Their perseverance bore fruit: Nandankanan became the first and only zoological garden worldwide to record multiple successful captive births of the Indian Pangolin, providing invaluable scientific data for international wildlife treaties.""",
            "featured": False
        },
        {
            "title": "Healing the Wild: The Nandankanan Rescue & Rehabilitation Mission",
            "slug": "rescue-and-rehabilitation",
            "category": "Animal Welfare",
            "cover_image": "/images/sanctuary_forest.jpg",
            "author": "Dr. Manoj Mohapatra, Senior Veterinary Surgeon",
            "read_time": "3 min read",
            "summary": "A 24/7 lifeline providing trauma triage, orthopedic surgical care, and re-wilding programs for injured wildlife across Eastern India.",
            "content": """Bordering the verdant Chandaka-Dampara wildlife corridor, Nandankanan functions not merely as a premier zoological park, but as a critical regional lifeline for distressed wildlife.

The park's Wildlife Rescue, Triage & Rehabilitation Centre is staffed 24 hours a day by seasoned wildlife veterinarians and rapid-response rescue teams. From injured elephant calves separated from herds and electrocuted leopards to orphaned spotted deer and rescued migratory waterbirds, hundreds of animals receive intensive critical care annually.

Animals that make full recoveries are carefully conditioned in soft-release enclosures before being returned to protected sanctuaries in Similipal, Satkosia, and Chandaka.""",
            "featured": False
        }
    ]

    for s in stories_data:
        ConservationStory.objects.create(**s)
    print("Created 4 conservation stories.")

    print("Seeding sample sponsorships...")
    sponsorships_data = [
        {
            "donor_name": "Aarav Sharma",
            "donor_email": "aarav.sharma@gmail.com",
            "donor_phone": "+91 98765 43210",
            "animal": animal_objs["royal-bengal-tiger"],
            "tier": "Gold Guardian",
            "duration_months": 12,
            "amount": 60000,
            "certificate_id": "NKZ-2026-TIG001",
            "personal_message": "Honored to support the majestic Royal Bengal Tiger at Nandankanan."
        },
        {
            "donor_name": "Priyanka Mohanty",
            "donor_email": "priyanka.m@techfoundation.in",
            "donor_phone": "+91 98234 56789",
            "animal": animal_objs["white-bengal-tiger"],
            "tier": "Platinum Champion",
            "duration_months": 12,
            "amount": 102000,
            "certificate_id": "NKZ-2026-WHT002",
            "personal_message": "Proud of Odisha's white tiger heritage! Protecting our natural treasures."
        },
        {
            "donor_name": "Vikramaditya Patnaik",
            "donor_email": "vikram.patnaik@bhubaneswar.org",
            "donor_phone": "+91 99112 33445",
            "animal": animal_objs["asian-elephant"],
            "tier": "Silver Defender",
            "duration_months": 6,
            "amount": 30000,
            "certificate_id": "NKZ-2026-ELE003",
            "personal_message": "For the gentle giants of the Chandaka forest corridor."
        }
    ]

    for sp in sponsorships_data:
        Sponsorship.objects.create(**sp)
    print("Created 3 initial sponsorships.")
    print("Database seeding completed successfully!")

if __name__ == '__main__':
    seed()
