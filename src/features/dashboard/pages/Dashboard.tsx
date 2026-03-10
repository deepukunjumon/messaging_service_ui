import { useEffect, useState } from "react";
import axios from "../../../services/axios";
import API from "../../../config/api.config";
import { theme } from "../../../styles/theme";
import Card from "../../../components/Card";

interface Service {
  service: string;
  label: string;
  status: number;
}

const Dashboard = () => {
  const [isDark, setIsDark] = useState(
    document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const observer = new MutationObserver(() =>
      setIsDark(document.documentElement.classList.contains("dark")),
    );

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const colors = {
    primary: isDark ? theme.brand.primary.dark : theme.brand.primary.light,
    text: isDark ? theme.brand.text.dark : theme.brand.text.primary,
    muted: theme.brand.text.muted,
    border: isDark ? theme.brand.border.dark : theme.brand.border.light,
    surface: isDark ? theme.brand.surface.dark : theme.brand.surface.light,
    background: isDark
      ? theme.brand.background.dark
      : theme.brand.background.light,
  };

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API.DASHBOARD.SERVICE_STATS);
      setServices(res.data?.data || []);
    } catch (e) {
      console.error("Failed to fetch services:", e);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const getStatus = (status: number) => {
    if (status === 1) {
      return { label: "Active", color: "#22c55e" };
    }
    return { label: "Down", color: "#ef4444" };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1
          className="text-xl font-bold tracking-tight"
          style={{ color: colors.primary }}
        >
          Dashboard
        </h1>

        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
          Overview of available services.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {services.map((service) => {
          const status = getStatus(service.status);

          return (
            <Card key={service.service} colors={colors}>
              <div className="flex items-center justify-between">
                <div>
                  <div
                    className="text-xs"
                    style={{ color: colors.muted }}
                  >
                    {service.service.toUpperCase()}
                  </div>

                  <div
                    className="mt-1 text-lg font-semibold"
                    style={{ color: colors.text }}
                  >
                    {service.label}
                  </div>
                </div>

                <div
                  className="text-sm rounded-full px-3 py-1 flex items-center gap-2"
                  style={{
                    backgroundColor: `${status.color}20`,
                    color: status.color,
                  }}
                >
                  <span
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      backgroundColor: status.color,
                    }}
                  />
                  {status.label}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Loading overlay */}
      {loading && (
        <div className="flex justify-center pt-4">
          <span className="text-sm" style={{ color: colors.muted }}>
            Loading services...
          </span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;