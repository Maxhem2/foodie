export type FoodBlogEntrySchema = {
    code: string;
    product: Product;
    status: number;
    status_verbose: string;
};

interface Product {
    _id: string;
    _keywords: string[];
    added_countries_tags: any[];
    additives_debug_tags: any[];
    additives_n: number;
    additives_old_n: number;
    additives_old_tags: string[];
    additives_original_tags: string[];
    additives_prev_original_tags: string[];
    additives_tags: string[];
    allergens: string;
    allergens_from_ingredients: string;
    allergens_from_user: string;
    allergens_hierarchy: string[];
    allergens_tags: string[];
    amino_acids_prev_tags: any[];
    amino_acids_tags: any[];
    brand_owner: string;
    brand_owner_imported: string;
    brands: string;
    brands_tags: string[];
    categories: string;
    categories_hierarchy: string[];
    categories_imported: string;
    categories_lc: string;
    categories_old: string;
    categories_properties: CategoriesProperties;
    categories_properties_tags: string[];
    categories_tags: string[];
    category_properties: CategoriesProperties;
    checkers: any[];
    checkers_tags: any[];
    ciqual_food_name_tags: string[];
    cities_tags: any[];
    code: string;
    codes_tags: string[];
    compared_to_category: string;
    complete: number;
    completeness: number;
    correctors: string[];
    correctors_tags: string[];
    countries: string;
    countries_debug_tags: any[];
    countries_hierarchy: string[];
    countries_imported: string;
    countries_lc: string;
    countries_tags: string[];
    created_t: number;
    creator: string;
    data_quality_bugs_tags: any[];
    data_quality_errors_tags: any[];
    data_quality_info_tags: string[];
    data_quality_tags: string[];
    data_quality_warnings_tags: string[];
    data_sources: string;
    data_sources_imported: string;
    data_sources_tags: string[];
    debug_param_sorted_langs: string[];
    ecoscore_data: EcoscoreData;
    ecoscore_grade: string;
    ecoscore_tags: string[];
    editors: string[];
    editors_tags: string[];
    emb_codes: string;
    emb_codes_20141016: string;
    emb_codes_debug_tags: any[];
    emb_codes_orig: string;
    emb_codes_tags: any[];
    entry_dates_tags: string[];
    expiration_date: string;
    expiration_date_debug_tags: any[];
    food_groups: string;
    food_groups_tags: string[];
    "fruits-vegetables-nuts_100g_estimate": number;
    generic_name: string;
    generic_name_de: string;
    generic_name_en: string;
    generic_name_en_debug_tags: any[];
    id: string;
    image_front_small_url: string;
    image_front_thumb_url: string;
    image_front_url: string;
    image_ingredients_small_url: string;
    image_ingredients_thumb_url: string;
    image_ingredients_url: string;
    image_nutrition_small_url: string;
    image_nutrition_thumb_url: string;
    image_nutrition_url: string;
    image_small_url: string;
    image_thumb_url: string;
    image_url: string;
    images: Images;
    informers: string[];
    informers_tags: string[];
    ingredients: Ingredient[];
    ingredients_analysis: IngredientsAnalysis;
    ingredients_analysis_tags: string[];
    ingredients_debug: Array<null | string>;
    ingredients_from_or_that_may_be_from_palm_oil_n: number;
    ingredients_from_palm_oil_n: number;
    ingredients_from_palm_oil_tags: any[];
    ingredients_hierarchy: string[];
    ingredients_ids_debug: string[];
    ingredients_n: number;
    ingredients_n_tags: string[];
    ingredients_original_tags: string[];
    ingredients_percent_analysis: number;
    ingredients_tags: string[];
    ingredients_text: string;
    ingredients_text_debug: string;
    ingredients_text_en: string;
    ingredients_text_en_debug_tags: any[];
    ingredients_text_en_imported: string;
    ingredients_text_with_allergens: string;
    ingredients_text_with_allergens_en: string;
    ingredients_that_may_be_from_palm_oil_n: number;
    ingredients_that_may_be_from_palm_oil_tags: any[];
    ingredients_with_specified_percent_n: number;
    ingredients_with_specified_percent_sum: number;
    ingredients_with_unspecified_percent_n: number;
    ingredients_with_unspecified_percent_sum: number;
    ingredients_without_ciqual_codes: string[];
    ingredients_without_ciqual_codes_n: number;
    interface_version_created: string;
    interface_version_modified: string;
    known_ingredients_n: number;
    labels: string;
    labels_hierarchy: string[];
    labels_lc: string;
    labels_old: string;
    labels_tags: string[];
    lang: string;
    lang_debug_tags: any[];
    languages: Languages;
    languages_codes: LanguagesCodes;
    languages_hierarchy: string[];
    languages_tags: string[];
    last_edit_dates_tags: string[];
    last_editor: string;
    last_image_dates_tags: string[];
    last_image_t: number;
    last_modified_by: string;
    last_modified_t: number;
    lc: string;
    lc_imported: string;
    link: string;
    link_debug_tags: any[];
    main_countries_tags: any[];
    manufacturing_places: string;
    manufacturing_places_debug_tags: any[];
    manufacturing_places_tags: any[];
    max_imgid: string;
    minerals_prev_tags: any[];
    minerals_tags: any[];
    misc_tags: string[];
    new_additives_n: number;
    no_nutrition_data: string;
    nova_group: number;
    nova_group_debug: string;
    nova_groups: string;
    nova_groups_markers: { [key: string]: Array<string[]> };
    nova_groups_tags: string[];
    nucleotides_prev_tags: any[];
    nucleotides_tags: any[];
    nutrient_levels: NutrientLevels;
    nutrient_levels_tags: string[];
    nutriments: Nutriments;
    nutriscore: { [key: string]: Nutriscore };
    nutriscore_2021_tags: string[];
    nutriscore_2023_tags: string[];
    nutriscore_data: NutriscoreData;
    nutriscore_grade: string;
    nutriscore_score: number;
    nutriscore_score_opposite: number;
    nutriscore_tags: string[];
    nutriscore_version: string;
    nutrition_data: string;
    nutrition_data_per: string;
    nutrition_data_per_debug_tags: any[];
    nutrition_data_per_imported: string;
    nutrition_data_prepared: string;
    nutrition_data_prepared_per: string;
    nutrition_data_prepared_per_debug_tags: any[];
    nutrition_data_prepared_per_imported: string;
    nutrition_grade_fr: string;
    nutrition_grades: string;
    nutrition_grades_tags: string[];
    nutrition_score_beverage: number;
    nutrition_score_debug: string;
    nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients: number;
    nutrition_score_warning_fruits_vegetables_legumes_estimate_from_ingredients_value: number;
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients: number;
    nutrition_score_warning_fruits_vegetables_nuts_estimate_from_ingredients_value: number;
    origins: string;
    origins_hierarchy: string[];
    origins_lc: string;
    origins_old: string;
    origins_tags: string[];
    other_nutritional_substances_tags: any[];
    packaging: string;
    packaging_hierarchy: string[];
    packaging_lc: string;
    packaging_materials_tags: any[];
    packaging_old: string;
    packaging_old_before_taxonomization: string;
    packaging_recycling_tags: any[];
    packaging_shapes_tags: string[];
    packaging_tags: string[];
    packagings: ProductPackaging[];
    packagings_materials: PackagingsMaterials;
    packagings_n: number;
    photographers: string[];
    photographers_tags: string[];
    pnns_groups_1: string;
    pnns_groups_1_tags: string[];
    pnns_groups_2: string;
    pnns_groups_2_tags: string[];
    popularity_key: number;
    popularity_tags: string[];
    product_name: string;
    product_name_de: string;
    product_name_en: string;
    product_name_en_debug_tags: any[];
    product_name_en_imported: string;
    product_quantity: string;
    purchase_places: string;
    purchase_places_debug_tags: any[];
    purchase_places_tags: any[];
    quantity: string;
    quantity_debug_tags: any[];
    removed_countries_tags: any[];
    rev: number;
    scans_n: number;
    selected_images: SelectedImages;
    serving_quantity: string;
    serving_size: string;
    serving_size_debug_tags: any[];
    serving_size_imported: string;
    sortkey: number;
    sources: Source[];
    sources_fields: SourcesFields;
    states: string;
    states_hierarchy: string[];
    states_tags: string[];
    stores: string;
    stores_debug_tags: any[];
    stores_tags: any[];
    traces: string;
    traces_debug_tags: any[];
    traces_from_ingredients: string;
    traces_from_user: string;
    traces_hierarchy: string[];
    traces_tags: string[];
    unique_scans_n: number;
    unknown_ingredients_n: number;
    unknown_nutrients_tags: any[];
    update_key: string;
    vitamins_prev_tags: any[];
    vitamins_tags: any[];
    weighers_tags: any[];
}

interface CategoriesProperties {}

interface EcoscoreData {
    adjustments: Adjustments;
    agribalyse: Agribalyse;
    missing: Missing;
    missing_agribalyse_match_warning: number;
    scores: CategoriesProperties;
    status: string;
}

interface Adjustments {
    origins_of_ingredients: OriginsOfIngredients;
    packaging: AdjustmentsPackaging;
    production_system: ProductionSystem;
    threatened_species: CategoriesProperties;
}

interface OriginsOfIngredients {
    aggregated_origins: AggregatedOrigin[];
    epi_score: number;
    epi_value: number;
    origins_from_origins_field: string[];
    transportation_score: number;
    transportation_scores: { [key: string]: number };
    transportation_value: number;
    transportation_values: { [key: string]: number };
    value: number;
    values: { [key: string]: number };
}

interface AggregatedOrigin {
    epi_score: string;
    origin: string;
    percent: number;
    transportation_score: null;
}

interface AdjustmentsPackaging {
    non_recyclable_and_non_biodegradable_materials: number;
    packagings: PackagingPackaging[];
    score: number;
    value: number;
    warning: string;
}

interface PackagingPackaging {
    ecoscore_material_score: number;
    ecoscore_shape_ratio: number;
    material: string;
    shape: string;
}

interface ProductionSystem {
    labels: any[];
    value: number;
    warning: string;
}

interface Agribalyse {
    warning: string;
}

interface Missing {
    agb_category: number;
    labels: number;
    packagings: number;
}

interface Images {
    "1": The1;
    "2": The1;
    "3": The1;
    "4": The1;
    "5": The1;
    front: FrontEnClass;
    front_en: FrontEnClass;
    ingredients: FrontEnClass;
    ingredients_en: FrontEnClass;
    nutrition: FrontEnClass;
    nutrition_en: FrontEnClass;
}

interface The1 {
    sizes: Sizes;
    uploaded_t: number;
    uploader: string;
}

interface Sizes {
    "100": The100;
    "400": The100;
    full: The100;
    "200"?: The100;
}

interface The100 {
    h: number;
    w: number;
}

interface FrontEnClass {
    geometry: string;
    imgid: string;
    normalize: null | string;
    rev: string;
    sizes: Sizes;
    white_magic: null;
}

interface Ingredient {
    id: string;
    ingredients?: Ingredient[];
    percent_estimate: number;
    percent_max: number;
    percent_min: number;
    text: string;
    vegan?: Veg;
    vegetarian?: Veg;
    ciqual_food_code?: string;
    processing?: string;
}

enum Veg {
    Maybe = "maybe",
    Yes = "yes",
}

interface IngredientsAnalysis {
    "en:palm-oil-content-unknown": string[];
    "en:vegan-status-unknown": string[];
    "en:vegetarian-status-unknown": string[];
}

interface Languages {
    "en:english": number;
}

interface LanguagesCodes {
    en: number;
}

interface NutrientLevels {
    fat: string;
    salt: string;
    "saturated-fat": string;
    sugars: string;
}

interface Nutriments {
    calcium: number;
    calcium_100g: number;
    calcium_serving: number;
    calcium_unit: string;
    calcium_value: number;
    carbohydrates: number;
    carbohydrates_100g: number;
    carbohydrates_serving: number;
    carbohydrates_unit: string;
    carbohydrates_value: number;
    cholesterol: number;
    cholesterol_100g: number;
    cholesterol_serving: number;
    cholesterol_unit: string;
    cholesterol_value: number;
    energy: number;
    "energy-kcal": number;
    "energy-kcal_100g": number;
    "energy-kcal_serving": number;
    "energy-kcal_unit": string;
    "energy-kcal_value": number;
    "energy-kcal_value_computed": number;
    energy_100g: number;
    energy_serving: number;
    energy_unit: string;
    energy_value: number;
    fat: number;
    fat_100g: number;
    fat_serving: number;
    fat_unit: string;
    fat_value: number;
    fiber: number;
    fiber_100g: number;
    fiber_serving: number;
    fiber_unit: string;
    fiber_value: number;
    "fruits-vegetables-legumes-estimate-from-ingredients_100g": number;
    "fruits-vegetables-legumes-estimate-from-ingredients_serving": number;
    "fruits-vegetables-nuts-estimate-from-ingredients_100g": number;
    "fruits-vegetables-nuts-estimate-from-ingredients_serving": number;
    iron: number;
    iron_100g: number;
    iron_serving: number;
    iron_unit: string;
    iron_value: number;
    "nova-group": number;
    "nova-group_100g": number;
    "nova-group_serving": number;
    "nutrition-score-fr": number;
    "nutrition-score-fr_100g": number;
    proteins: number;
    proteins_100g: number;
    proteins_serving: number;
    proteins_unit: string;
    proteins_value: number;
    salt: number;
    salt_100g: number;
    salt_serving: number;
    salt_unit: string;
    salt_value: number;
    "saturated-fat": number;
    "saturated-fat_100g": number;
    "saturated-fat_serving": number;
    "saturated-fat_unit": string;
    "saturated-fat_value": number;
    sodium: number;
    sodium_100g: number;
    sodium_serving: number;
    sodium_unit: string;
    sodium_value: number;
    sugars: number;
    sugars_100g: number;
    sugars_serving: number;
    sugars_unit: string;
    sugars_value: number;
    "trans-fat": number;
    "trans-fat_100g": number;
    "trans-fat_serving": number;
    "trans-fat_unit": string;
    "trans-fat_value": number;
    "vitamin-a": number;
    "vitamin-a_100g": number;
    "vitamin-a_serving": number;
    "vitamin-a_unit": string;
    "vitamin-a_value": number;
    "vitamin-c": number;
    "vitamin-c_100g": number;
    "vitamin-c_serving": number;
    "vitamin-c_unit": string;
    "vitamin-c_value": number;
}

interface Nutriscore {
    category_available: number;
    data: Data;
    grade: string;
    nutrients_available: number;
    nutriscore_applicable: number;
    nutriscore_computed: number;
    score: number;
}

interface Data {
    energy: number;
    energy_points: number;
    energy_value?: number;
    fiber: number;
    fiber_points: number;
    fiber_value?: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils?: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_points?: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_value?: number;
    is_beverage: number;
    is_cheese: number;
    is_fat?: number;
    is_water: number;
    negative_points: number;
    positive_points: number;
    proteins: number;
    proteins_points: number;
    proteins_value?: number;
    saturated_fat: number;
    saturated_fat_points: number;
    saturated_fat_value?: number;
    sodium?: number;
    sodium_points?: number;
    sodium_value?: number;
    sugars: number;
    sugars_points: number;
    sugars_value?: number;
    grade?: string;
    score?: number;
    count_proteins?: number;
    count_proteins_reason?: string;
    fruits_vegetables_legumes?: number;
    fruits_vegetables_legumes_points?: number;
    is_fat_oil_nuts_seeds?: number;
    is_red_meat_product?: number;
    negative_nutrients?: string[];
    positive_nutrients?: string[];
    salt?: number;
    salt_points?: number;
}

interface NutriscoreData {
    energy: number;
    energy_points: number;
    energy_value: number;
    fiber: number;
    fiber_points: number;
    fiber_value: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_points: number;
    fruits_vegetables_nuts_colza_walnut_olive_oils_value: number;
    is_beverage: number;
    is_cheese: number;
    is_fat: number;
    is_water: number;
    negative_points: number;
    positive_points: number;
    proteins: number;
    proteins_points: number;
    proteins_value: number;
    saturated_fat: number;
    saturated_fat_points: number;
    saturated_fat_value: number;
    sodium: number;
    sodium_points: number;
    sodium_value: number;
    sugars: number;
    sugars_points: number;
    sugars_value: number;
    grade?: string;
    score?: number;
}

interface ProductPackaging {
    shape: string;
}

interface PackagingsMaterials {
    all: CategoriesProperties;
    "en:unknown": CategoriesProperties;
}

interface SelectedImages {
    front: SelectedImagesFront;
    ingredients: SelectedImagesFront;
    nutrition: SelectedImagesFront;
}

interface SelectedImagesFront {
    display: Display;
    small: Display;
    thumb: Display;
}

interface Display {
    en: string;
}

interface Source {
    fields: string[];
    id: string;
    images: any[];
    import_t: number;
    url: null | string;
    manufacturer?: null;
    name?: string;
}

interface SourcesFields {
    "org-database-usda": OrgDatabaseUsda;
}

interface OrgDatabaseUsda {
    available_date: Date;
    fdc_category: string;
    fdc_data_source: string;
    fdc_id: string;
    modified_date: Date;
    publication_date: Date;
}
