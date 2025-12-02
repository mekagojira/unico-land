"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { api, type CompanyInfo, type Service } from "@/lib/api";

interface FooterProps {
  companyInfo?: CompanyInfo | null;
}

export default function Footer({ companyInfo }: FooterProps) {
  const t = useTranslations("footer");
  const params = useParams();
  const locale = (params?.locale as string) || "jp";

  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const servicesData = await api.getServices(true, locale);
        setServices(servicesData);
      } catch (error) {
        // Silently fail - footer will show empty services list
      }
    };

    fetchServices();
  }, [locale]);

  const footerLinks = {
    home: ["home", "about"],
    news: ["news", "blog"],
  };

  return (
    <footer
      id="contact"
      className="bg-gray-900 text-gray-300 relative overflow-hidden"
    >
      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      ></div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          <div className="lg:col-span-2">
            {companyInfo?.logoUrl && (
              <div className="mb-6">
                <Image
                  src={companyInfo.logoUrl}
                  alt={companyInfo.name || "Uni-Co 株式会社"}
                  width={200}
                  height={67}
                  className="h-16 w-auto object-contain"
                  unoptimized
                />
              </div>
            )}
            <div className="space-y-3 text-sm text-gray-400 font-light leading-relaxed">
              <p>{companyInfo?.address || t("address")}</p>
              {(companyInfo?.address2 || t("address2")) && (
                <p>{companyInfo?.address2 || t("address2")}</p>
              )}
              <p className="mt-6">
                <span className="font-semibold text-gray-300">{t("tel")}</span>{" "}
                {companyInfo?.phone || t("telNumber")}
              </p>
              <p>
                <span className="font-semibold text-gray-300">
                  {t("hours")}
                </span>
                ／{companyInfo?.hours || t("hoursTime")}
              </p>
              {(companyInfo?.closed || t("closedDays")) && (
                <p>
                  <span className="font-semibold text-gray-300">
                    {t("closed")}
                  </span>
                  ／{companyInfo?.closed || t("closedDays")}
                </p>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">
              {t("sections.home")}
            </h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.home.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors font-light"
                  >
                    {t(`links.${link}`)}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://uni-co-group.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-400 transition-colors font-light"
                >
                  {t("companyWebsite")}
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">
              {t("sections.services")}
            </h4>
            <ul className="space-y-3 text-sm">
              {services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id}>
                    <Link
                      href={`/service/${service.id}`}
                      className="hover:text-blue-400 transition-colors font-light"
                    >
                      {service.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/service"
                    className="hover:text-blue-400 transition-colors font-light"
                  >
                    {t("links.services")}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6 tracking-wide">
              {t("sections.news")}
            </h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.news.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="hover:text-blue-400 transition-colors font-light"
                  >
                    {t(`links.${link}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-500 font-light">{t("copyright")}</p>
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-500 font-light">
              <a
                href="https://uni-co-group.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400 transition-colors font-light"
              >
                {t("companyWebsite")}
              </a>
              <span className="hidden md:inline">|</span>
              <span>{t("tagline")}</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
