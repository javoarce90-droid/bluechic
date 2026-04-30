-- Blue Chic — Seed Data
-- Productos de catálogo con variantes de talle y color
-- Las imágenes se actualizan luego desde Supabase Storage

-- ─── HELPERS ────────────────────────────────────────────────────────────────
-- Usamos variables para referenciar los UUIDs de los productos al insertar variantes

do $$
declare
  -- Blazers - Juvenil
  p_blazer_oversize     uuid := gen_random_uuid();
  p_blazer_cruzado      uuid := gen_random_uuid();
  p_blazer_crop         uuid := gen_random_uuid();

  -- Bodies - Juvenil
  p_body_escote_v       uuid := gen_random_uuid();
  p_body_modal          uuid := gen_random_uuid();
  p_body_cuello_alto    uuid := gen_random_uuid();

  -- Bodies - Plus30
  p_body_liso_plus      uuid := gen_random_uuid();
  p_body_elastizado     uuid := gen_random_uuid();

  -- Remeras - Juvenil
  p_remera_basica       uuid := gen_random_uuid();
  p_remera_print        uuid := gen_random_uuid();
  p_remera_crop         uuid := gen_random_uuid();

  -- Remeras - Plus30
  p_remera_manga_larga  uuid := gen_random_uuid();
  p_remera_hombro       uuid := gen_random_uuid();

  -- Pantalones - Juvenil
  p_pantalon_baggy      uuid := gen_random_uuid();
  p_pantalon_recto      uuid := gen_random_uuid();

  -- Pantalones - Plus30
  p_pantalon_palazzo    uuid := gen_random_uuid();
  p_pantalon_clasico    uuid := gen_random_uuid();

  -- Vestidos - Juvenil
  p_vestido_midi        uuid := gen_random_uuid();
  p_vestido_camisero    uuid := gen_random_uuid();

  -- Vestidos - Plus30
  p_vestido_noche       uuid := gen_random_uuid();
  p_vestido_wrap        uuid := gen_random_uuid();

begin

-- ─── PRODUCTS ───────────────────────────────────────────────────────────────

insert into products (id, name, slug, category, collection, price, description, images, featured, active) values

  -- BLAZERS
  (p_blazer_oversize, 'Blazer Oversize Premium', 'blazer-oversize-premium', 'blazers', 'juvenil',
   32500, 'Blazer oversize de tela sastrera de alta calidad. Solapa clásica, bolsillos laterales con vivo y forro interior. Perfecto para looks day-to-night.',
   '{}', true, true),

  (p_blazer_cruzado, 'Blazer Cruzado Elegante', 'blazer-cruzado-elegante', 'blazers', 'juvenil',
   35900, 'Blazer cruzado de doble botonadura en tela structured. Silueta entallada que estiliza la figura. Ideal para el trabajo o salidas especiales.',
   '{}', false, true),

  (p_blazer_crop, 'Blazer Crop Trendy', 'blazer-crop-trendy', 'blazers', 'juvenil',
   28900, 'Blazer corto con mangas tres cuartos. Confeccionado en tela de bengalina elastizada. Combina con jeans, vestidos o pantalones de vestir.',
   '{}', true, true),

  -- BODIES - JUVENIL
  (p_body_escote_v, 'Body Escote en V', 'body-escote-v', 'bodies', 'juvenil',
   15900, 'Body con escote en V profundo y cierre en la parte inferior. Tela modal de tacto suave, elastizada para mayor comodidad. Tiro normal.',
   '{}', true, true),

  (p_body_modal, 'Body Modal Básico', 'body-modal-basico', 'bodies', 'juvenil',
   13500, 'Body básico en tela modal premium. Cuello redondo, manga corta. Esencial en cualquier guardarropas, combina con todo.',
   '{}', false, true),

  (p_body_cuello_alto, 'Body Cuello Alto Liso', 'body-cuello-alto-liso', 'bodies', 'juvenil',
   16800, 'Body de cuello alto en tela elastizada de calidad superior. Perfecto para la temporada fría, se lleva por dentro o por fuera.',
   '{}', false, true),

  -- BODIES - PLUS30
  (p_body_liso_plus, 'Body Liso Plus30', 'body-liso-plus30', 'bodies', 'plus30',
   14900, 'Body liso con escote redondo y amplia tabla de colores. Tela elastizada de primera calidad. Desde el talle S al XL con excelente calce.',
   '{}', false, true),

  (p_body_elastizado, 'Body Elastizado Comfort', 'body-elastizado-comfort', 'bodies', 'plus30',
   16500, 'Body con mayor porcentaje de elastano para un confort excepcional. Ideal para usar todo el día. Cuello bote y manga corta.',
   '{}', true, true),

  -- REMERAS - JUVENIL
  (p_remera_basica, 'Remera Básica Premium', 'remera-basica-premium', 'remeras', 'juvenil',
   9900, 'Remera básica de algodón peinado 100%. Cuello redondo reforzado, excelente caída. El básico que no puede faltar en tu guardarropas.',
   '{}', false, true),

  (p_remera_print, 'Remera con Print Floral', 'remera-print-floral', 'remeras', 'juvenil',
   12500, 'Remera con estampado floral exclusivo de la temporada. Tela suave y fresca, perfecta para el calor. Combina con jeans o faldas.',
   '{}', true, true),

  (p_remera_crop, 'Remera Crop Fit', 'remera-crop-fit', 'remeras', 'juvenil',
   11200, 'Remera corta entallada de algodón elastizado. Largo justo a la cintura, ideal para looks deportivos o casual. Cuello redondo.',
   '{}', false, true),

  -- REMERAS - PLUS30
  (p_remera_manga_larga, 'Remera Manga Larga Cozy', 'remera-manga-larga-cozy', 'remeras', 'plus30',
   13800, 'Remera de manga larga en tela térmica suave. Corte levemente holgado para mayor comodidad. Excelente para las noches frescas.',
   '{}', false, true),

  (p_remera_hombro, 'Remera Off Shoulder', 'remera-off-shoulder', 'remeras', 'plus30',
   14200, 'Remera con escote off-shoulder elástico. Tela viscosa de excelente caída. Un look femenino y cómodo para cualquier ocasión.',
   '{}', true, true),

  -- PANTALONES - JUVENIL
  (p_pantalon_baggy, 'Pantalón Baggy Cargo', 'pantalon-baggy-cargo', 'pantalones', 'juvenil',
   27500, 'Pantalón baggy estilo cargo con bolsillos laterales. Tela de gabardina liviana. Tendencia total, combiná con un top o crop.',
   '{}', true, true),

  (p_pantalon_recto, 'Pantalón Recto Clásico', 'pantalon-recto-clasico', 'pantalones', 'juvenil',
   24900, 'Pantalón de corte recto en tela de bengalina. Tiro normal, bolsillos frontales y cierre lateral. Versátil y elegante.',
   '{}', false, true),

  -- PANTALONES - PLUS30
  (p_pantalon_palazzo, 'Pantalón Palazzo Fluido', 'pantalon-palazzo-fluido', 'pantalones', 'plus30',
   26800, 'Pantalón palazzo de tela viscosa con excelente caída. Amplia pierna, muy cómodo y elegante a la vez. Ideal para ocasiones especiales.',
   '{}', true, true),

  (p_pantalon_clasico, 'Pantalón Clásico Elastizado', 'pantalon-clasico-elastizado', 'pantalones', 'plus30',
   22500, 'Pantalón con pretina elastizada para mayor comodidad. Tela structured que no se arruga. Tiro alto, estiliza la silueta.',
   '{}', false, true),

  -- VESTIDOS - JUVENIL
  (p_vestido_midi, 'Vestido Midi Floral', 'vestido-midi-floral', 'vestidos', 'juvenil',
   38500, 'Vestido midi con estampado floral de temporada. Escote en V con botones decorativos, manga corta con volado. Largo hasta la rodilla.',
   '{}', true, true),

  (p_vestido_camisero, 'Vestido Camisero Satinado', 'vestido-camisero-satinado', 'vestidos', 'juvenil',
   42000, 'Vestido camisero en tela satinada con brillo sutil. Cierre de botones frontales, cinturón incluido. Ideal para look de noche o eventos.',
   '{}', true, true),

  -- VESTIDOS - PLUS30
  (p_vestido_noche, 'Vestido de Noche Elegante', 'vestido-noche-elegante', 'vestidos', 'plus30',
   55000, 'Vestido de noche en tela crepe de excelente caída. Escote corazón, sin mangas. Corte A que favorece todas las figuras.',
   '{}', true, true),

  (p_vestido_wrap, 'Vestido Wrap Casual', 'vestido-wrap-casual', 'vestidos', 'plus30',
   36900, 'Vestido cruzado wrap de tela viscosa. Fruncido en la cintura que define la silueta. Versátil: va del trabajo a la salida nocturna.',
   '{}', false, true);


-- ─── PRODUCT VARIANTS ───────────────────────────────────────────────────────

insert into product_variants (product_id, size, color, stock) values

  -- Blazer Oversize Premium
  (p_blazer_oversize, 'XS', 'Negro',    5),
  (p_blazer_oversize, 'S',  'Negro',    8),
  (p_blazer_oversize, 'M',  'Negro',    6),
  (p_blazer_oversize, 'L',  'Negro',    4),
  (p_blazer_oversize, 'XL', 'Negro',    3),
  (p_blazer_oversize, 'XS', 'Beige',    4),
  (p_blazer_oversize, 'S',  'Beige',    6),
  (p_blazer_oversize, 'M',  'Beige',    5),
  (p_blazer_oversize, 'L',  'Beige',    3),
  (p_blazer_oversize, 'S',  'Blanco',   5),
  (p_blazer_oversize, 'M',  'Blanco',   4),
  (p_blazer_oversize, 'L',  'Blanco',   3),

  -- Blazer Cruzado Elegante
  (p_blazer_cruzado, 'XS', 'Negro',    4),
  (p_blazer_cruzado, 'S',  'Negro',    6),
  (p_blazer_cruzado, 'M',  'Negro',    5),
  (p_blazer_cruzado, 'L',  'Negro',    3),
  (p_blazer_cruzado, 'XL', 'Negro',    2),
  (p_blazer_cruzado, 'S',  'Gris',     4),
  (p_blazer_cruzado, 'M',  'Gris',     4),
  (p_blazer_cruzado, 'L',  'Gris',     3),

  -- Blazer Crop Trendy
  (p_blazer_crop, 'XS', 'Negro',       6),
  (p_blazer_crop, 'S',  'Negro',       8),
  (p_blazer_crop, 'M',  'Negro',       5),
  (p_blazer_crop, 'L',  'Negro',       3),
  (p_blazer_crop, 'XS', 'Crudo',       4),
  (p_blazer_crop, 'S',  'Crudo',       5),
  (p_blazer_crop, 'M',  'Crudo',       4),

  -- Body Escote en V
  (p_body_escote_v, 'XS', 'Negro',     10),
  (p_body_escote_v, 'S',  'Negro',     12),
  (p_body_escote_v, 'M',  'Negro',      8),
  (p_body_escote_v, 'L',  'Negro',      6),
  (p_body_escote_v, 'XL', 'Negro',      4),
  (p_body_escote_v, 'XS', 'Blanco',     8),
  (p_body_escote_v, 'S',  'Blanco',    10),
  (p_body_escote_v, 'M',  'Blanco',     7),
  (p_body_escote_v, 'L',  'Blanco',     5),
  (p_body_escote_v, 'S',  'Camel',      6),
  (p_body_escote_v, 'M',  'Camel',      5),
  (p_body_escote_v, 'L',  'Camel',      4),

  -- Body Modal Básico
  (p_body_modal, 'XS', 'Negro',        8),
  (p_body_modal, 'S',  'Negro',       10),
  (p_body_modal, 'M',  'Negro',        8),
  (p_body_modal, 'L',  'Negro',        6),
  (p_body_modal, 'XL', 'Negro',        4),
  (p_body_modal, 'XS', 'Blanco',       6),
  (p_body_modal, 'S',  'Blanco',       8),
  (p_body_modal, 'M',  'Blanco',       6),
  (p_body_modal, 'XS', 'Gris',         5),
  (p_body_modal, 'S',  'Gris',         6),
  (p_body_modal, 'M',  'Gris',         5),

  -- Body Cuello Alto
  (p_body_cuello_alto, 'XS', 'Negro',  7),
  (p_body_cuello_alto, 'S',  'Negro',  9),
  (p_body_cuello_alto, 'M',  'Negro',  6),
  (p_body_cuello_alto, 'L',  'Negro',  4),
  (p_body_cuello_alto, 'XL', 'Negro',  3),
  (p_body_cuello_alto, 'S',  'Crudo',  5),
  (p_body_cuello_alto, 'M',  'Crudo',  4),
  (p_body_cuello_alto, 'L',  'Crudo',  3),

  -- Body Liso Plus30
  (p_body_liso_plus, 'S',  'Negro',    8),
  (p_body_liso_plus, 'M',  'Negro',    8),
  (p_body_liso_plus, 'L',  'Negro',    7),
  (p_body_liso_plus, 'XL', 'Negro',    5),
  (p_body_liso_plus, 'S',  'Blanco',   6),
  (p_body_liso_plus, 'M',  'Blanco',   6),
  (p_body_liso_plus, 'L',  'Blanco',   5),
  (p_body_liso_plus, 'XL', 'Blanco',   4),
  (p_body_liso_plus, 'M',  'Rosa',      5),
  (p_body_liso_plus, 'L',  'Rosa',      4),

  -- Body Elastizado Comfort
  (p_body_elastizado, 'S',  'Negro',   9),
  (p_body_elastizado, 'M',  'Negro',   8),
  (p_body_elastizado, 'L',  'Negro',   7),
  (p_body_elastizado, 'XL', 'Negro',   5),
  (p_body_elastizado, 'S',  'Nude',    5),
  (p_body_elastizado, 'M',  'Nude',    5),
  (p_body_elastizado, 'L',  'Nude',    4),

  -- Remera Básica Premium
  (p_remera_basica, 'XS', 'Negro',    12),
  (p_remera_basica, 'S',  'Negro',    15),
  (p_remera_basica, 'M',  'Negro',    12),
  (p_remera_basica, 'L',  'Negro',     8),
  (p_remera_basica, 'XL', 'Negro',     5),
  (p_remera_basica, 'XS', 'Blanco',   10),
  (p_remera_basica, 'S',  'Blanco',   12),
  (p_remera_basica, 'M',  'Blanco',   10),
  (p_remera_basica, 'L',  'Blanco',    7),
  (p_remera_basica, 'XL', 'Blanco',    4),
  (p_remera_basica, 'S',  'Gris',      8),
  (p_remera_basica, 'M',  'Gris',      8),
  (p_remera_basica, 'L',  'Gris',      6),

  -- Remera Print Floral
  (p_remera_print, 'XS', 'Multicolor', 6),
  (p_remera_print, 'S',  'Multicolor', 8),
  (p_remera_print, 'M',  'Multicolor', 7),
  (p_remera_print, 'L',  'Multicolor', 5),
  (p_remera_print, 'XL', 'Multicolor', 3),

  -- Remera Crop Fit
  (p_remera_crop, 'XS', 'Negro',       8),
  (p_remera_crop, 'S',  'Negro',      10),
  (p_remera_crop, 'M',  'Negro',       7),
  (p_remera_crop, 'L',  'Negro',       5),
  (p_remera_crop, 'XS', 'Blanco',      6),
  (p_remera_crop, 'S',  'Blanco',      8),
  (p_remera_crop, 'M',  'Blanco',      6),
  (p_remera_crop, 'S',  'Rosa',        6),
  (p_remera_crop, 'M',  'Rosa',        5),
  (p_remera_crop, 'L',  'Rosa',        4),

  -- Remera Manga Larga Cozy
  (p_remera_manga_larga, 'S',  'Negro',  7),
  (p_remera_manga_larga, 'M',  'Negro',  7),
  (p_remera_manga_larga, 'L',  'Negro',  6),
  (p_remera_manga_larga, 'XL', 'Negro',  4),
  (p_remera_manga_larga, 'S',  'Gris',   5),
  (p_remera_manga_larga, 'M',  'Gris',   5),
  (p_remera_manga_larga, 'L',  'Gris',   4),
  (p_remera_manga_larga, 'S',  'Beige',  4),
  (p_remera_manga_larga, 'M',  'Beige',  4),

  -- Remera Off Shoulder
  (p_remera_hombro, 'S',  'Negro',      8),
  (p_remera_hombro, 'M',  'Negro',      7),
  (p_remera_hombro, 'L',  'Negro',      6),
  (p_remera_hombro, 'XL', 'Negro',      4),
  (p_remera_hombro, 'S',  'Blanco',     6),
  (p_remera_hombro, 'M',  'Blanco',     5),
  (p_remera_hombro, 'L',  'Blanco',     4),
  (p_remera_hombro, 'S',  'Camel',      4),
  (p_remera_hombro, 'M',  'Camel',      4),

  -- Pantalón Baggy Cargo
  (p_pantalon_baggy, 'XS', 'Negro',     5),
  (p_pantalon_baggy, 'S',  'Negro',     7),
  (p_pantalon_baggy, 'M',  'Negro',     6),
  (p_pantalon_baggy, 'L',  'Negro',     4),
  (p_pantalon_baggy, 'XL', 'Negro',     3),
  (p_pantalon_baggy, 'XS', 'Kaki',      4),
  (p_pantalon_baggy, 'S',  'Kaki',      6),
  (p_pantalon_baggy, 'M',  'Kaki',      5),
  (p_pantalon_baggy, 'L',  'Kaki',      3),
  (p_pantalon_baggy, 'S',  'Gris',      4),
  (p_pantalon_baggy, 'M',  'Gris',      4),

  -- Pantalón Recto Clásico
  (p_pantalon_recto, 'XS', 'Negro',     6),
  (p_pantalon_recto, 'S',  'Negro',     8),
  (p_pantalon_recto, 'M',  'Negro',     6),
  (p_pantalon_recto, 'L',  'Negro',     4),
  (p_pantalon_recto, 'XL', 'Negro',     3),
  (p_pantalon_recto, 'S',  'Beige',     5),
  (p_pantalon_recto, 'M',  'Beige',     5),
  (p_pantalon_recto, 'L',  'Beige',     4),
  (p_pantalon_recto, 'S',  'Blanco',    4),
  (p_pantalon_recto, 'M',  'Blanco',    4),

  -- Pantalón Palazzo Fluido
  (p_pantalon_palazzo, 'S',  'Negro',   7),
  (p_pantalon_palazzo, 'M',  'Negro',   7),
  (p_pantalon_palazzo, 'L',  'Negro',   6),
  (p_pantalon_palazzo, 'XL', 'Negro',   4),
  (p_pantalon_palazzo, 'S',  'Blanco',  5),
  (p_pantalon_palazzo, 'M',  'Blanco',  5),
  (p_pantalon_palazzo, 'L',  'Blanco',  4),
  (p_pantalon_palazzo, 'S',  'Coral',   4),
  (p_pantalon_palazzo, 'M',  'Coral',   4),

  -- Pantalón Clásico Elastizado
  (p_pantalon_clasico, 'S',  'Negro',   8),
  (p_pantalon_clasico, 'M',  'Negro',   8),
  (p_pantalon_clasico, 'L',  'Negro',   7),
  (p_pantalon_clasico, 'XL', 'Negro',   5),
  (p_pantalon_clasico, 'S',  'Gris',    5),
  (p_pantalon_clasico, 'M',  'Gris',    5),
  (p_pantalon_clasico, 'L',  'Gris',    4),
  (p_pantalon_clasico, 'M',  'Beige',   4),
  (p_pantalon_clasico, 'L',  'Beige',   4),

  -- Vestido Midi Floral
  (p_vestido_midi, 'XS', 'Multicolor',  4),
  (p_vestido_midi, 'S',  'Multicolor',  6),
  (p_vestido_midi, 'M',  'Multicolor',  5),
  (p_vestido_midi, 'L',  'Multicolor',  4),
  (p_vestido_midi, 'XL', 'Multicolor',  3),

  -- Vestido Camisero Satinado
  (p_vestido_camisero, 'XS', 'Negro',   4),
  (p_vestido_camisero, 'S',  'Negro',   5),
  (p_vestido_camisero, 'M',  'Negro',   4),
  (p_vestido_camisero, 'L',  'Negro',   3),
  (p_vestido_camisero, 'XS', 'Champagne', 3),
  (p_vestido_camisero, 'S',  'Champagne', 4),
  (p_vestido_camisero, 'M',  'Champagne', 3),
  (p_vestido_camisero, 'S',  'Bordo',   4),
  (p_vestido_camisero, 'M',  'Bordo',   3),

  -- Vestido de Noche Elegante
  (p_vestido_noche, 'S',  'Negro',      5),
  (p_vestido_noche, 'M',  'Negro',      5),
  (p_vestido_noche, 'L',  'Negro',      4),
  (p_vestido_noche, 'XL', 'Negro',      3),
  (p_vestido_noche, 'S',  'Bordo',      4),
  (p_vestido_noche, 'M',  'Bordo',      4),
  (p_vestido_noche, 'L',  'Bordo',      3),
  (p_vestido_noche, 'S',  'Verde Noche', 3),
  (p_vestido_noche, 'M',  'Verde Noche', 3),

  -- Vestido Wrap Casual
  (p_vestido_wrap, 'S',  'Negro',       6),
  (p_vestido_wrap, 'M',  'Negro',       6),
  (p_vestido_wrap, 'L',  'Negro',       5),
  (p_vestido_wrap, 'XL', 'Negro',       4),
  (p_vestido_wrap, 'S',  'Estampado',   4),
  (p_vestido_wrap, 'M',  'Estampado',   4),
  (p_vestido_wrap, 'L',  'Estampado',   3);

end $$;
