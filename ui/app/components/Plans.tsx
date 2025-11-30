"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import Image from "next/image";
import { api, type Service } from "@/lib/api";

export default function Plans() {
  const t = useTranslations("services");
  const params = useParams();
  const locale = (params?.locale as string) || "jp";

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await api.getServices(true, locale);
        // Sort by orderIndex if available
        const sortedServices = servicesData.sort(
          (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
        );
        setServices(sortedServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
        // Keep empty array on error
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [locale]);

  return (
    <section
      id="services"
      className="py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white via-stone-50/20 to-white relative overflow-hidden"
    >
      {/* Luxury background pattern */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h20v20H0zM20 20h20v20H20zM40 40h20v20H40zM60 60h20v20H60z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16 lg:mb-24">
          <div className="inline-block mb-4 md:mb-6">
            <span className="text-xs font-medium text-blue-700 tracking-[0.2em] uppercase">
              {t("badge")}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extralight text-gray-900 mb-6 md:mb-8 tracking-tighter leading-[1.05] px-4">
            {t("title")}
          </h2>
          <div className="w-32 md:w-40 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent mx-auto mb-6 md:mb-8"></div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 font-light max-w-3xl mx-auto leading-relaxed px-4">
            {t("subtitle")}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-3xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-white border border-blue-200/50 p-6 sm:p-8 md:p-10 lg:p-12 animate-pulse"
              >
                <div className="h-12 w-12 bg-gray-200 rounded mb-4"></div>
                <div className="h-8 bg-gray-200 rounded mb-3"></div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-8">
            {services.map((service) => {
              const hasImage = service.images && service.images.length > 0;
              const firstImage = hasImage ? service.images[0] : null;

              return (
                <div
                  key={service.id}
                  className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-blue-100/50 to-white border border-blue-200/50 hover:border-blue-300 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2"
                >
                  {/* Luxury shine effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%]"></div>

                  {firstImage && (
                    <div className="relative h-48 md:h-56 overflow-hidden">
                      <Image
                        src={firstImage}
                        alt={service.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        quality={90}
                        sizes="(max-width: 768px) 100vw, 33vw"
                        unoptimized={
                          firstImage.includes("unsplash.com") ||
                          firstImage.includes("r2.cloudflarestorage.com")
                        }
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>
                  )}

                  <div className="relative p-6 sm:p-8 md:p-10 lg:p-12">
                    <div className="mb-4 md:mb-6">
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-900 mb-3 md:mb-4 tracking-tight">
                        {service.title}
                      </h3>
                      <p className="text-sm sm:text-base md:text-lg text-gray-600 font-light leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg font-light">
              {t("noServices") || "No services available"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
