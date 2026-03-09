<?php

namespace Database\Seeders;

use App\Models\AdminUser;
use App\Models\Booking;
use App\Models\ContactSubmission;
use App\Models\Event;
use App\Models\GalleryImage;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');

        // ── Admin Users ──
        AdminUser::truncate();
        AdminUser::insert([
            [
                'email' => 'admin@darlouka.com',
                'password' => 'admin123',
                'name' => 'Admin',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'email' => 'test@darlouka.com',
                'password' => 'test123',
                'name' => 'Test Admin',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'email' => 'manager@darlouka.com',
                'password' => 'manager123',
                'name' => 'Manager',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
        ]);

        // ── Rooms ──
        Room::truncate();
        Room::insert([
            [
                'id' => 1,
                'name_en' => 'Aghmat 2',
                'name_fr' => 'Aghmat 2',
                'description_en' => 'This twin room features a infinity pool. The twin room features air conditioning, a wardrobe, as well as a private bathroom boasting a walk-in shower and a hairdryer. The twin room offers heating and garden views. The unit has 1 double bed or two single beds.',
                'description_fr' => "Cette chambre lits jumeaux se distingue par sa piscine à débordement. Elle dispose de la climatisation, d'une penderie et d'une salle de bains privative pourvue d'une douche à l'italienne et d'un sèche-cheveux.\n\nLa chambre est équipée du chauffage et offre une vue agréable sur le jardin. Cet hébergement comprend un lit.",
                'price' => 600,
                'capacity' => 2,
                'amenities' => '["Mountain View","Air Conditioning","Heated Shower"]',
                'image' => '/uploads/rooms/aghmat2/IMG_7200.JPG.jpeg',
                'images' => json_encode([
                    '/uploads/rooms/aghmat2/IMG_7200.JPG.jpeg',
                    '/uploads/rooms/aghmat2/IMG_2244.JPG.jpeg',
                    '/uploads/rooms/aghmat2/IMG_7823.JPG.jpeg',
                    '/uploads/rooms/aghmat2/IMG_7572.jpeg',
                    '/uploads/rooms/aghmat2/IMG_3342.PNG',
                    '/uploads/rooms/aghmat2/IMG_6317.PNG',
                ]),
                'ical_import_urls' => '[]',
                'ical_token' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2026-02-09 10:46:54',
            ],
            [
                'id' => 2,
                'name_en' => 'Aghmat 1',
                'name_fr' => 'Aghmat 1',
                'description_en' => "Comfortable beds .\nGuests will have a special experience as the twin/double room provides a infinity pool. The twin/double room offers air conditioning, a wardrobe, as well as a private bathroom featuring a walk-in shower and a hairdryer. The twin/double room features heating and garden views. The unit offers 1 doubled bed or two single beds.",
                'description_fr' => "Les clients vivront une expérience privilégiée grâce à la piscine à débordement . Climatisée et chauffée, elle comprend une penderie ainsi qu'une salle de bains privative dotée d'une douche à l'italienne et d'un sèche-cheveux.\n\nL'hébergement offre une vue sur le jardin et est équipé, au choix, d'un grand lit double ou de deux lits simples.",
                'price' => 600,
                'capacity' => 2,
                'amenities' => '["Queen Bed","Garden Access","Courtyard View","Air Conditioning","Ensuite Bathroom","Heating Shower"]',
                'image' => '/uploads/rooms/aghmat1/IMG_7093.JPG.jpeg',
                'images' => json_encode([
                    '/uploads/rooms/aghmat1/IMG_7093.JPG.jpeg',
                    '/uploads/rooms/aghmat1/IMG_7570.jpeg',
                    '/uploads/rooms/aghmat1/IMG_7211.JPG.jpeg',
                    '/uploads/rooms/aghmat1/IMG_7826.JPG.jpeg',
                    '/uploads/rooms/aghmat1/IMG_7561.JPG.jpeg',
                    '/uploads/rooms/aghmat1/IMG_6236.jpeg',
                    '/uploads/rooms/aghmat1/IMG_6421.jpeg',
                    '/uploads/rooms/aghmat1/IMG_6592.jpeg',
                ]),
                'ical_import_urls' => '[]',
                'ical_token' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2026-02-09 11:02:26',
            ],
            [
                'id' => 3,
                'name_en' => 'Louka',
                'name_fr' => 'Louka',
                'description_en' => "This triple room's standout feature is the pool with a view. The triple room offers air conditioning, a wardrobe, a large terrace with garden views and montains as well as a private bathroom boasting a walk-in shower.\nYou can have 1 double bed and 1 single or 3 single beds.",
                'description_fr' => "L'atout majeur de cette chambre triple est sa piscine avec vue. Elle dispose de la climatisation, d'une penderie et d'une terrasse offrant une vue sur le jardin. Sa salle de bains privative est quant à elle dotée d'une douche à l'italienne.\nVous pouvez avoir 1 grand lit double et 1 lit simple ou 3 lits simple.",
                'price' => 900,
                'capacity' => 3,
                'amenities' => '["2 Bedrooms","Living Area","Mountain View","Air Conditioning","Kitchen Access","Bathroom"]',
                'image' => '/uploads/rooms/louka/WhatsApp Image 2026-02-09 at 12.27.22.jpeg',
                'images' => json_encode([
                    '/uploads/rooms/louka/WhatsApp Image 2026-02-09 at 12.27.22.jpeg',
                    '/uploads/rooms/louka/IMG_7561.JPG.jpeg',
                    '/uploads/rooms/louka/IMG_7064.JPG.jpeg',
                    '/uploads/rooms/louka/IMG_6307.jpeg',
                    '/uploads/rooms/louka/IMG_6410.jpeg',
                    '/uploads/rooms/louka/IMG_7001.jpeg',
                ]),
                'ical_import_urls' => '[]',
                'ical_token' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2026-02-09 11:29:12',
            ],
            [
                'id' => 4,
                'name_en' => 'Issil Room',
                'name_fr' => 'Chambre Issil',
                'description_en' => "The pool with a view is the standout feature of this quadruple room. The quadruple room features air conditioning, a wardrobe, a terrace with garden views as well as a private bathroom boasting a walk-in shower.\n4 single beds or 2 doubled beds.",
                'description_fr' => "L'atout majeur de cette chambre quadruple est sa piscine avec vue. Elle dispose de la climatisation, d'une penderie et d'une terrasse donnant sur le jardin. Sa salle de bains privative est pourvue d'une douche à l'italienne.\n4 lits simple ou 2 grand lits double.",
                'price' => 1100,
                'capacity' => 4,
                'amenities' => '["Double Bed","Traditional Design","Air Conditioning","Bathroom","Terrace Access"]',
                'image' => '/uploads/rooms/issil/IMG_7064.JPG.jpeg',
                'images' => json_encode([
                    '/uploads/rooms/issil/IMG_7064.JPG.jpeg',
                    '/uploads/rooms/issil/IMG_7042.JPG.jpeg',
                    '/uploads/rooms/issil/IMG_6410.jpeg',
                ]),
                'ical_import_urls' => '[]',
                'ical_token' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2026-02-09 11:36:42',
            ],
        ]);

        // ── Events ──
        Event::truncate();
        Event::insert([
            [
                'id' => 1,
                'title_en' => '3-Night Package at Dar Louka',
                'title_fr' => 'Forfait 3 Nuits à Dar Louka',
                'description_en' => 'Silence and Shiatsu Escape 40km from Marrakech. Transfer from Marrakech included.',
                'description_fr' => "L'Évasion Silence et Shiatsu à 40km de Marrakech. Transfert de marrakech inclus.",
                'start_date' => '2025-01-15 00:00:00',
                'end_date' => '2025-01-18 00:00:00',
                'type' => 'THREE_DAYS',
                'program_en' => json_encode("Day 1 (Anchoring): Arrival, immersion, settling into tranquility and softness then Dinner\nDay 2 (Repair): Breakfast (light), followed by your Expert Shiatsu Session (1h30 min), including 20 min of infrared sauna beforehand, then at the end of the day a gentle hike to discover the Hinterland.\nDay 3 (Integration): Body Awakening (Yoga/Gentle Movements), \"Vitality\" Lunch, with a green juice among others then Self-Care Workshop (Reflexology Techniques) for the return. In the afternoon discovery of Imlil with a small hike\nDay 4 (Departure and Intention): Departure according to flight, equipped with some tips to maintain the benefits"),
                'program_fr' => json_encode("Jour 1 (Ancrage) : Arrivée, immersion, installation dans la tranquillité et la douceur puis Dîner\nJour 2 (Réparation) : Petit-déjeuner (légér, suivi de votre Séance Shiatsu Expert (1h30 min),inclue au préalable du soin un 20 mn de sauna infra rouge puis en fin de journée une randonnée douce pour la Découverte de l'Arrière-Pays.\nJour 3 (Intégration) : Éveil Corporel (Yoga/Mouvements Doux), Déjeuner »Vitalité », avec un jus vert entre autre puis Atelier d'Auto-Soin (Techniques de Réflexologie) pour le retour. En après midi découverte d'imlil avec petite randonnée\nJour 4 (Départ et Intention : Départ en fonction du vol, muni de quelques conseils pour maintenir les bénéfices"),
                'max_participants' => 4,
                'price' => 590,
                'image' => '/uploads/rooms/louka/IMG_6410.jpeg',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 2,
                'title_en' => '1-Day Retreat at Dar Louka',
                'title_fr' => 'Forfait 1 jour retraite à Dar Louka',
                'description_en' => 'Silence and Shiatsu Escape 40km from Marrakech. Transfer from Marrakech included.',
                'description_fr' => "L'Évasion Silence et Shiatsu à 40km de Marrakech. Transfert de marrakech inclus.",
                'start_date' => '2025-01-20 00:00:00',
                'end_date' => null,
                'type' => 'ONE_DAY',
                'program_en' => json_encode("10:00 - 10:30 Private Transfer and Arrival: The client leaves the noise of the city.\n10:30 - 11:00 Welcome & Silencing Anchoring: Welcome tea and discovery of the place. Invitation to leave the phone aside\n11:00 - 12:30 The Expert Care Energy Repair: Complete Shiatsu and Reflexology session (60 min).\n12:30 - 13:30 Free Resourcing Integration: Free access to the pool, gardens and reading corners. The client takes advantage of the silence to integrate the benefits of the care.\n13:30 - 14:30 Detox Lunch Nourish and Cleanse: Light and healthy lunch (Balanced Detox Cuisine), ideal not to weigh down the body after the care.\n14:30 - 15:30 Pause and Disconnection Closing: Last moment of calm before the return.\n15:30 - 16:00 Departure and Private Return: The client leaves rested, realigned, joyful."),
                'program_fr' => json_encode("10h00 - 10h30 Transfert Privé et Arrivée : Le client quitte le bruit de la ville.\n10h30 - 11h00 Accueil & Mise en Silence Ancrage : Thé de bienvenue et découverte du lieu. Invitation à laisser le téléphone de côté\n11h00 - 12h30 Le Soin Expert Réparation Énergétique : Séance complète de Shiatsu et Réflexologie (60 min).\n12h30 - 13h30 Ressourcement Libre Intégration : Accès libre à la piscine, aux jardins et aux coins de lecture. Le client profite du silence pour intégrer les bénéfices du soin.\n13h30 - 14h30 Déjeuner Détox Nourrir et Nettoyer : Déjeuner léger et sain (Cuisine Équilibrée Détox), idéal pour ne pas alourdir le corps après le soin.\n14h30 - 15h30 Pause et Déconnexion Clôture : Dernier moment de calme avant le retour.\n15h30 - 16h00 Départ et Retour Privé : Le client repart reposé, réaligné, joyeux."),
                'max_participants' => 2,
                'price' => 125,
                'image' => '/uploads/rooms/aghmat1/IMG_6236.jpeg',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
        ]);

        // ── Gallery Images ──
        GalleryImage::truncate();
        GalleryImage::insert([
            [
                'id' => 1,
                'title_en' => 'Aghmat 2 Room',
                'title_fr' => 'Chambre Aghmat 2',
                'description_en' => 'Comfortable twin room with garden views and modern amenities',
                'description_fr' => 'Chambre lits jumeaux confortable avec vue sur le jardin et équipements modernes',
                'image' => '/uploads/rooms/aghmat2/IMG_7200.JPG.jpeg',
                'category' => 'Rooms',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 2,
                'title_en' => 'Atlas Mountains View',
                'title_fr' => "Vue sur les Montagnes de l'Atlas",
                'description_en' => 'Stunning panoramic view of the Atlas Mountains from our terrace',
                'description_fr' => "Vue panoramique époustouflante des Montagnes de l'Atlas depuis notre terrasse",
                'image' => '/uploads/rooms/louka/IMG_7561.JPG.jpeg',
                'category' => 'Landscape',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 3,
                'title_en' => 'Aghmat 1 Room',
                'title_fr' => 'Chambre Aghmat 1',
                'description_en' => 'Elegant room with traditional Moroccan design and courtyard view',
                'description_fr' => 'Chambre élégante au design marocain traditionnel avec vue sur la cour',
                'image' => '/uploads/rooms/aghmat1/IMG_7093.JPG.jpeg',
                'category' => 'Rooms',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 4,
                'title_en' => 'Garden & Pool',
                'title_fr' => 'Jardin & Piscine',
                'description_en' => 'Lush garden with infinity pool and Atlas Mountain backdrop',
                'description_fr' => "Jardin luxuriant avec piscine à débordement et montagnes de l'Atlas en toile de fond",
                'image' => '/uploads/rooms/louka/IMG_6410.jpeg',
                'category' => 'Garden',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 5,
                'title_en' => 'Louka Suite',
                'title_fr' => 'Suite Louka',
                'description_en' => 'Spacious triple room with pool views and terrace access',
                'description_fr' => 'Chambre triple spacieuse avec vue piscine et accès terrasse',
                'image' => '/uploads/rooms/louka/WhatsApp Image 2026-02-09 at 12.27.22.jpeg',
                'category' => 'Rooms',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 6,
                'title_en' => 'Issil Room Interior',
                'title_fr' => 'Intérieur Chambre Issil',
                'description_en' => 'Quadruple room with traditional design and air conditioning',
                'description_fr' => "Chambre quadruple au design traditionnel et climatisation",
                'image' => '/uploads/rooms/issil/IMG_7064.JPG.jpeg',
                'category' => 'Rooms',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 7,
                'title_en' => 'Bedroom Comfort',
                'title_fr' => 'Confort de Chambre',
                'description_en' => 'Cozy bedroom with warm lighting and traditional Moroccan décor',
                'description_fr' => 'Chambre confortable avec éclairage chaleureux et décoration marocaine traditionnelle',
                'image' => '/uploads/rooms/aghmat1/IMG_7211.JPG.jpeg',
                'category' => 'Rooms',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 8,
                'title_en' => 'Outdoor Terrace',
                'title_fr' => 'Terrasse Extérieure',
                'description_en' => 'Relaxing outdoor terrace with garden and mountain views',
                'description_fr' => 'Terrasse extérieure relaxante avec vue sur le jardin et les montagnes',
                'image' => '/uploads/rooms/louka/IMG_7064.JPG.jpeg',
                'category' => 'Spaces',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 9,
                'title_en' => 'Peaceful Retreat',
                'title_fr' => 'Retraite Paisible',
                'description_en' => 'Serene atmosphere surrounded by nature at Dar Louka',
                'description_fr' => 'Atmosphère sereine entourée de nature à Dar Louka',
                'image' => '/uploads/rooms/issil/IMG_7042.JPG.jpeg',
                'category' => 'Landscape',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
        ]);

        // ── Bookings ──
        Booking::truncate();
        Booking::insert([
            [
                'id' => 1,
                'room_id' => 1,
                'event_id' => null,
                'check_in' => '2024-12-20 00:00:00',
                'check_out' => '2024-12-23 00:00:00',
                'guests' => 2,
                'name' => 'John Smith',
                'email' => 'john@example.com',
                'phone' => '+1234567890',
                'special_requests' => 'Early check-in if possible',
                'status' => 'confirmed',
                'booking_com_id' => 'BC123456',
                'airbnb_id' => null,
                'tripadvisor_id' => null,
                'external_status' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 2,
                'room_id' => 1,
                'event_id' => null,
                'check_in' => '2024-12-25 00:00:00',
                'check_out' => '2024-12-28 00:00:00',
                'guests' => 2,
                'name' => 'Sarah Johnson',
                'email' => 'sarah@example.com',
                'phone' => '+1987654321',
                'special_requests' => 'Honeymoon suite decoration',
                'status' => 'pending',
                'booking_com_id' => null,
                'airbnb_id' => 'AB789012',
                'tripadvisor_id' => null,
                'external_status' => null,
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
        ]);

        // ── Contact Submissions ──
        ContactSubmission::truncate();
        ContactSubmission::insert([
            [
                'id' => 1,
                'name' => 'Emma Wilson',
                'email' => 'emma@example.com',
                'phone' => '+33123456789',
                'subject' => 'Group Booking Inquiry',
                'message' => 'We are interested in booking your guesthouse for a group of 8 people for a week in January. Could you provide information about group rates?',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
            [
                'id' => 2,
                'name' => 'Marco Rossi',
                'email' => 'marco@example.com',
                'phone' => '+39987654321',
                'subject' => 'Event Customization',
                'message' => 'We would like to organize a private event at your property. Can you provide details about event hosting and catering options?',
                'created_at' => '2025-12-24 10:52:14',
                'updated_at' => '2025-12-24 10:52:14',
            ],
        ]);

        DB::statement('SET FOREIGN_KEY_CHECKS=1;');
    }
}
