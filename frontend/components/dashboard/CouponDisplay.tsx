import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FiGrid,
  FiList,
  FiSearch,
  FiTag,
  FiCalendar,
  FiTrash2,
} from "react-icons/fi";
import { format } from "date-fns";
import { theme } from "../../utils/theme";
import { useAuth } from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import FavoriteButton from "../coupon/FavoriteButton";
import { deleteExpiredCoupons } from "../../services/supabase";

interface Coupon {
  id: string;
  brand: string;
  brand_logo: string;
  description: string;
  savings: string;
  expiration_date: string;
  criteria: string;
  category: string;
  featured?: boolean;
  deal_link?: string;
  promo_code?: string;
}

interface CouponDisplayProps {
  coupons: Coupon[];
  category: string;
  loading: boolean;
  error: string | null;
  refreshCoupons?: () => void;
}

const CouponDisplay = ({
  coupons,
  category,
  loading,
  error,
  refreshCoupons,
}: CouponDisplayProps) => {
  const [viewMode, setViewMode] = useState<"card" | "list">("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [displayLimit, setDisplayLimit] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isDeletingExpired, setIsDeletingExpired] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotification();

  // Filter coupons based on search query
  const filteredCoupons = useMemo(() => {
    return coupons.filter(
      (coupon) =>
        coupon.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        coupon.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [coupons, searchQuery]);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);

      // Adjust display limit based on screen size
      if (width < 600) {
        setDisplayLimit(2);
      } else if (width < 900) {
        setDisplayLimit(3);
      } else {
        setDisplayLimit(4);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle deleting expired coupons
  const handleDeleteExpiredCoupons = async () => {
    setIsDeletingExpired(true);

    try {
      const { success, count, error } = await deleteExpiredCoupons();

      if (success) {
        addNotification(
          "success",
          `Successfully deleted ${count} expired coupon${
            count !== 1 ? "s" : ""
          }`
        );
        // Use the refreshCoupons function instead of reloading the page
        if (refreshCoupons) {
          refreshCoupons();
        }
      } else {
        addNotification(
          "error",
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Failed to delete expired coupons"
        );
      }
    } catch (err) {
      addNotification("error", "An unexpected error occurred");
    } finally {
      setIsDeletingExpired(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "300px",
          backgroundColor: theme.colors.neutral[100],
          borderRadius: theme.borderRadius.lg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: theme.colors.neutral[600],
        }}
      >
        Loading coupons...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          padding: "16px",
          backgroundColor: theme.colors.error.light + "20",
          color: theme.colors.error.dark,
          borderRadius: theme.borderRadius.lg,
          display: "flex",
          alignItems: "center",
          gap: "8px",
        }}
      >
        {error}
      </div>
    );
  }

  if (filteredCoupons.length === 0) {
    return (
      <div
        style={{
          padding: "32px",
          textAlign: "center",
          backgroundColor: theme.colors.neutral[50],
          borderRadius: theme.borderRadius.lg,
          color: theme.colors.neutral[600],
        }}
      >
        No coupons found for {category}
        {searchQuery ? ` matching "${searchQuery}"` : ""}.
      </div>
    );
  }

  const displayedCoupons = filteredCoupons.slice(0, displayLimit);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: theme.colors.neutral[800],
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <FiTag style={{ color: theme.colors.primary.main }} />
          {category} Coupons
        </h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
          }}
        >
          {user && (
            <button
              onClick={handleDeleteExpiredCoupons}
              disabled={isDeletingExpired}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                backgroundColor: theme.colors.error.main,
                color: "white",
                border: "none",
                borderRadius: theme.borderRadius.md,
                cursor: isDeletingExpired ? "not-allowed" : "pointer",
                opacity: isDeletingExpired ? 0.7 : 1,
                fontWeight: "500",
                fontSize: "13px",
              }}
            >
              <FiTrash2 size={14} />{" "}
              {isDeletingExpired ? "Deleting..." : "Delete Expired"}
            </button>
          )}
          <div
            style={{
              position: "relative",
              width: isMobile ? "100%" : "200px",
            }}
          >
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                padding: "8px 32px 8px 12px",
                borderRadius: theme.borderRadius.md,
                border: `1px solid ${theme.colors.neutral[300]}`,
                width: "100%",
                outline: "none",
                transition: "all 0.2s ease",
              }}
            />
            <FiSearch
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                color: theme.colors.neutral[500],
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              border: `1px solid ${theme.colors.neutral[300]}`,
              borderRadius: theme.borderRadius.md,
              overflow: "hidden",
            }}
          >
            <button
              onClick={() => setViewMode("card")}
              style={{
                padding: "6px 10px",
                background:
                  viewMode === "card"
                    ? theme.colors.primary.light + "20"
                    : "white",
                color:
                  viewMode === "card"
                    ? theme.colors.primary.main
                    : theme.colors.neutral[600],
                border: "none",
                borderRight: `1px solid ${theme.colors.neutral[300]}`,
                cursor: "pointer",
              }}
            >
              <FiGrid />
            </button>
            <button
              onClick={() => setViewMode("list")}
              style={{
                padding: "6px 10px",
                background:
                  viewMode === "list"
                    ? theme.colors.primary.light + "20"
                    : "white",
                color:
                  viewMode === "list"
                    ? theme.colors.primary.main
                    : theme.colors.neutral[600],
                border: "none",
                cursor: "pointer",
              }}
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "card" ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(auto-fill, minmax(${
              isMobile ? "100%" : "280px"
            }, 1fr))`,
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {displayedCoupons.map((coupon) => {
            const isExpired = new Date() > new Date(coupon.expiration_date);

            return (
              <div
                key={coupon.id}
                style={{
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.xl,
                  overflow: "hidden",
                  transition: "all 0.2s ease",
                  backgroundColor: "white",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.shadows.lg;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {isExpired && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: theme.colors.error.main,
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: theme.borderRadius.sm,
                      fontSize: "10px",
                      fontWeight: "bold",
                      zIndex: 3,
                    }}
                  >
                    EXPIRED
                  </div>
                )}

                {user && (
                  <div
                    style={{
                      position: "absolute",
                      top: "15px",
                      right: "15px",
                      zIndex: 2,
                    }}
                  >
                    <FavoriteButton
                      couponId={coupon.id}
                      coupon={coupon}
                      size="md"
                    />
                  </div>
                )}

                <Link
                  to={`/coupon/${coupon.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "block",
                  }}
                >
                  <div
                    style={{
                      padding: "12px",
                      borderBottom: `1px solid ${theme.colors.neutral[200]}`,
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      background: theme.colors.neutral[50],
                    }}
                  >
                    <img
                      src={coupon.brand_logo || "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/money%20bag/3D/money_bag_3d.png"}
                      alt={`${coupon.brand} logo`}
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: theme.borderRadius.md,
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <h3
                        style={{
                          fontWeight: "bold",
                          color: theme.colors.neutral[800],
                          margin: 0,
                        }}
                      >
                        {coupon.brand}
                      </h3>
                      <p
                        style={{
                          fontSize: "12px",
                          color: isExpired
                            ? theme.colors.error.main
                            : theme.colors.neutral[500],
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          margin: 0,
                        }}
                      >
                        <FiCalendar size={12} />
                        Expires:{" "}
                        {format(
                          new Date(coupon.expiration_date),
                          "MMM d, yyyy"
                        )}
                      </p>
                    </div>
                  </div>

                  <div style={{ padding: "16px" }}>
                    <p
                      style={{
                        fontWeight: "bold",
                        color: theme.colors.accent.main,
                        fontSize: "18px",
                        marginBottom: "8px",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                      title={coupon.savings}
                    >
                      {coupon.savings}
                    </p>
                    <p
                      style={{
                        fontSize: "14px",
                        marginBottom: "12px",
                        color: theme.colors.neutral[700],
                        height: "20px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                      title={coupon.description}
                    >
                      {coupon.description}
                    </p>
                    {coupon.criteria && (
                      <p
                        style={{
                          fontSize: "11px",
                          color: theme.colors.neutral[400],
                          marginBottom: "16px",
                          fontStyle: "italic",
                          height: "20px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: "vertical",
                        }}
                        title={coupon.criteria}
                      >
                        {coupon.criteria}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          {displayedCoupons.map((coupon) => {
            const isExpired = new Date() > new Date(coupon.expiration_date);

            return (
              <div
                key={coupon.id}
                style={{
                  border: `1px solid ${theme.colors.neutral[200]}`,
                  borderRadius: theme.borderRadius.xl,
                  padding: "16px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s ease",
                  backgroundColor: "white",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = theme.shadows.md;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {isExpired && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      backgroundColor: theme.colors.error.main,
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: theme.borderRadius.sm,
                      fontSize: "10px",
                      fontWeight: "bold",
                      zIndex: 3,
                    }}
                  >
                    EXPIRED
                  </div>
                )}

                {user && (
                  <div
                    style={{
                      position: "absolute",
                      top: isExpired ? "40px" : "10px",
                      right: "10px",
                      zIndex: 2,
                    }}
                  >
                    <FavoriteButton
                      couponId={coupon.id}
                      coupon={coupon}
                      size="sm"
                    />
                  </div>
                )}

                <Link
                  to={`/coupon/${coupon.id}`}
                  style={{
                    textDecoration: "none",
                    color: "inherit",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    width: "100%",
                  }}
                >
                  <img
                    src={coupon.brand_logo || "https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/money%20bag/3D/money_bag_3d.png"}
                    alt={`${coupon.brand} logo`}
                    style={{
                      width: "50px",
                      height: "50px",
                      borderRadius: theme.borderRadius.md,
                      objectFit: "cover",
                    }}
                  />

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "4px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <h3
                        style={{
                          fontWeight: "bold",
                          color: theme.colors.neutral[800],
                          margin: 0,
                        }}
                      >
                        {coupon.brand}
                      </h3>
                      <span
                        style={{
                          fontWeight: "bold",
                          color: theme.colors.accent.main,
                          maxWidth: "120px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          display: "inline-block",
                        }}
                        title={coupon.savings}
                      >
                        {coupon.savings}
                      </span>
                    </div>
                    <p
                      style={{
                        color: theme.colors.neutral[700],
                        margin: "4px 0",
                        maxWidth: "100%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                      title={coupon.description}
                    >
                      {coupon.description}
                    </p>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "8px",
                        flexWrap: "wrap",
                        gap: "8px",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          color: isExpired
                            ? theme.colors.error.main
                            : theme.colors.neutral[500],
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <FiCalendar size={12} />
                        <span>
                          Expires:{" "}
                          {format(
                            new Date(coupon.expiration_date),
                            "MMM d, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}

      {filteredCoupons.length > displayLimit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <Link
            to={`/category/${category
              .toLowerCase()
              .replace(/\\s+/g, "-")
              .replace("&", "and")}`}
            style={{
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "white",
              color: theme.colors.primary.main,
              border: `1px solid ${theme.colors.primary.main}`,
              borderRadius: theme.borderRadius.md,
              textDecoration: "none",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                theme.colors.primary.light + "10";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            View {category} Coupons ({filteredCoupons.length})
          </Link>
        </div>
      )}
    </div>
  );
};

export default CouponDisplay;
