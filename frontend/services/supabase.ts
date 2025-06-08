import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Subscribe to coupon changes for real-time updates
export const subscribeToCoupons = (callback: (payload: any) => void) => {
  return supabase
    .channel("coupons_changes")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "coupons",
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

// Subscribe to favorites changes for real-time updates
export const subscribeFavorites = (
  userId: string,
  callback: (payload: any) => void
) => {
  return supabase
    .channel("favorites_changes")
    .on(
      "postgres_changes",
      {
        event: "*", // Listen for all events (INSERT, UPDATE, DELETE)
        schema: "public",
        table: "favorites",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        callback(payload);
      }
    )
    .subscribe();
};

// Authentication functions
export const signUp = async (
  email: string,
  password: string,
  name?: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name || "",
      },
    },
  });

  if (error) {
    console.error("Error signing up:", error);
    return { user: null, error };
  }

  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: data.user.email,
        full_name: name || "",
        updated_at: new Date(),
      },
    ]);

    if (profileError) {
      console.error("Error creating profile:", profileError);
    }
  }

  return { user: data.user, error: null };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Error signing in:", error);
    return { session: null, error };
  }

  return { session: data.session, user: data.user, error: null };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
  }

  return { error };
};

export const resetPassword = async (email: string) => {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset-password",
  });

  if (error) {
    console.error("Error resetting password:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.error("Error getting current user:", error);
    return { user: null, error };
  }

  return { user: data.user, error: null };
};

// Profile functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error getting user profile:", error);
    return { profile: null, error };
  }

  return { profile: data, error: null };
};

export const updateUserProfile = async (
  userId: string,
  updates: { full_name?: string }
) => {
  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);

  if (error) {
    console.error("Error updating user profile:", error);
    return { success: false, error };
  }

  return { success: true, data };
};

export const updatePassword = async (password: string) => {
  const { error } = await supabase.auth.updateUser({
    password,
  });

  if (error) {
    console.error("Error updating password:", error);
    return { success: false, error };
  }

  return { success: true, error: null };
};

// Coupon functions
export const fetchCoupons = async (
  options: {
    category?: string;
    brandId?: string;
    search?: string;
    limit?: number;
    userId?: string;
  } = {}
) => {
  const { category, brandId, search, limit = 20, userId } = options;

  let query = supabase.from("coupons").select("*");

  // Filter by user_id if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  if (category && category !== "All") {
    query = query.eq("category", category);
  }

  if (brandId) {
    query = query.eq("brand", brandId);
  }

  if (search) {
    query = query.or(`description.ilike.%${search}%,brand.ilike.%${search}%`);
  }

  query = query.order("expiration_date", { ascending: true });

  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching coupons:", error);
    return [];
  }

  return data || [];
};

export const fetchCouponById = async (id: string) => {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching coupon by ID:", error);
    return null;
  }

  return data;
};

export const fetchFeaturedCoupons = async (userId?: string) => {
  let query = supabase.from("coupons").select("*").eq("featured", true);

  // Filter by user_id if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  query = query.limit(10);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching featured coupons:", error);
    return [];
  }

  return data || [];
};

export const fetchCouponsByCategory = async (
  category: string,
  userId?: string
) => {
  let query = supabase.from("coupons").select("*").eq("category", category);

  // Filter by user_id if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  query = query.order("expiration_date", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching coupons by category:", error);
    return [];
  }

  return data || [];
};

export const fetchCouponsByBrand = async (
  brandName: string,
  userId?: string
) => {
  let query = supabase.from("coupons").select("*").eq("brand", brandName);

  // Filter by user_id if provided
  if (userId) {
    query = query.eq("user_id", userId);
  }

  query = query.order("expiration_date", { ascending: true });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching coupons by brand:", error);
    return [];
  }

  return data || [];
};

// User favorites functions
export const fetchUserFavorites = async (userId: string) => {
  try {
    // Get all favorites for this user
    const { data: favIds, error: favError } = await supabase
      .from("favorites")
      .select("*")
      .eq("user_id", userId);

    if (favError) {
      console.error("Error fetching favorite IDs:", favError);
      return [];
    }

    if (!favIds || favIds.length === 0) {
      return [];
    }

    // Get the coupon IDs
    const couponIds = favIds.map((fav) => fav.coupon_id);

    // Fetch the actual coupons
    const { data: coupons, error: couponsError } = await supabase
      .from("coupons")
      .select("*")
      .in("id", couponIds);

    if (couponsError) {
      console.error("Error fetching coupons by IDs:", couponsError);
      return [];
    }

    return coupons || [];
  } catch (err) {
    console.error("Unexpected error in fetchUserFavorites:", err);
    return [];
  }
};

export const addFavorite = async (userId: string, couponId: string) => {
  try {
    // First check if it already exists
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", userId)
      .eq("coupon_id", couponId);

    if (existing && existing.length > 0) {
      return { success: true, data: existing[0] };
    }

    // If not, insert it
    const { data, error } = await supabase.from("favorites").insert({
      user_id: userId,
      coupon_id: couponId,
    });

    if (error) {
      console.error("Error adding favorite:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception in addFavorite:", err);
    return { success: false, error: err };
  }
};

export const removeFavorite = async (userId: string, couponId: string) => {
  try {
    const { data, error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("coupon_id", couponId);

    if (error) {
      console.error("Error removing favorite:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception in removeFavorite:", err);
    return { success: false, error: err };
  }
};

export const checkIsFavorite = async (userId: string, couponId: string) => {
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", userId)
    .eq("coupon_id", couponId);

  if (error) {
    console.error("Error checking favorite status:", error);
    return false;
  }

  return data && data.length > 0;
};

export const fetchBrands = async () => {
  // Get all coupons to extract unique brands
  const { data, error } = await supabase
    .from("coupons")
    .select("brand, brand_logo");

  if (error || !data) {
    console.error("Error fetching brands from coupons:", error);
    return [];
  }

  // Create unique brand objects from coupons data using a map for efficiency
  const brandMap: {
    [key: string]: {
      id: string;
      name: string;
      logo: string;
      coupons_count: number;
    };
  } = {};

  data.forEach((coupon) => {
    if (!brandMap[coupon.brand]) {
      brandMap[coupon.brand] = {
        id: coupon.brand,
        name: coupon.brand,
        logo: coupon.brand_logo,
        coupons_count: 1,
      };
    } else {
      brandMap[coupon.brand].coupons_count += 1;
    }
  });

  // Convert the map to an array and sort by brand name
  return Object.values(brandMap).sort((a, b) => a.name.localeCompare(b.name));
};

export const fetchBrandByName = async (name: string) => {
  // Get coupons for this brand to count them
  const { data, error } = await supabase
    .from("coupons")
    .select("brand, brand_logo")
    .eq("brand", name);

  if (error || !data || data.length === 0) {
    console.error("Error fetching brand by name:", error);
    return null;
  }

  // Create a brand object from the first coupon with this brand
  return {
    id: name,
    name: name,
    logo: data[0].brand_logo,
    coupons_count: data.length,
  };
};

// Helper function to update coupon counts for brands
export const updateBrandCouponCount = async (brandName: string) => {
  // First get the count
  const { count, error: countError } = await supabase
    .from("coupons")
    .select("*", { count: "exact", head: true })
    .eq("brand", brandName);

  if (countError) {
    console.error("Error counting coupons for brand:", countError);
    return { success: false, error: countError };
  }

  // Then update the brand
  const { data, error } = await supabase
    .from("brands")
    .update({ coupons_count: count })
    .eq("name", brandName);

  if (error) {
    console.error("Error updating brand coupon count:", error);
    return { success: false, error };
  }

  return { success: true, data };
};

// Function to delete all expired coupons
export const deleteExpiredCoupons = async () => {
  try {
    const currentDate = new Date().toISOString();

    // First, get the IDs of expired coupons that are in favorites
    const { data: expiredFavoriteCoupons, error: favError } = await supabase
      .from("coupons")
      .select("id")
      .lt("expiration_date", currentDate);

    if (favError) {
      console.error("Error fetching expired favorite coupons:", favError);
      return { success: false, error: favError };
    }

    // Delete from favorites table first (due to foreign key constraints)
    if (expiredFavoriteCoupons && expiredFavoriteCoupons.length > 0) {
      const expiredIds = expiredFavoriteCoupons.map((coupon) => coupon.id);

      const { error: deleteFavError } = await supabase
        .from("favorites")
        .delete()
        .in("coupon_id", expiredIds);

      if (deleteFavError) {
        console.error("Error deleting expired favorites:", deleteFavError);
        return { success: false, error: deleteFavError };
      }
    }

    // Then delete the expired coupons
    const { error } = await supabase
      .from("coupons")
      .delete()
      .lt("expiration_date", currentDate);

    if (error) {
      console.error("Error deleting expired coupons:", error);
      return { success: false, error };
    }

    return { success: true, count: expiredFavoriteCoupons?.length || 0 };
  } catch (err) {
    console.error("Exception in deleteExpiredCoupons:", err);
    return { success: false, error: err };
  }
};

// Function to process email-based coupons
export const processEmailCoupon = async (couponData: {
  brand: string;
  description: string;
  savings: string;
  expiration_date: Date;
  criteria: string;
  category: string;
  brand_logo?: string;
}) => {
  try {
    // Insert the coupon
    const { data, error } = await supabase.from("coupons").insert([
      {
        brand: couponData.brand,
        description: couponData.description,
        savings: couponData.savings,
        expiration_date: couponData.expiration_date,
        criteria: couponData.criteria || "Received via email",
        category: couponData.category || "Other",
        brand_logo: couponData.brand_logo || "/favicon.svg",
        featured: false,
        deal_link: "#",
      },
    ]);

    if (error) {
      console.error("Error processing email coupon:", error);
      return { success: false, error };
    }

    // Check if brand exists, if not create it
    const { data: brand } = await supabase
      .from("brands")
      .select("*")
      .eq("name", couponData.brand)
      .single();

    if (!brand) {
      await supabase.from("brands").insert([
        {
          name: couponData.brand,
          logo: couponData.brand_logo || "/favicon.svg",
          coupons_count: 1,
        },
      ]);
    } else {
      // Update coupon count
      await updateBrandCouponCount(couponData.brand);
    }

    return { success: true, data };
  } catch (err) {
    console.error("Exception in processEmailCoupon:", err);
    return { success: false, error: err };
  }
};
