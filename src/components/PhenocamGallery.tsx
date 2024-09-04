"use client";

import React, { useCallback, useEffect, useState } from "react";
import DatePicker, { registerLocale, setDefaultLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays } from "date-fns";
import { Phenocam } from "@/app/page";
import Image from "next/image";
import { PROXY_URL } from "@/app/constants";
import { parseImageFilename } from "@/app/utils";
import { es } from "date-fns/locale/es";

type PhenocamGalleryProps = {
  phenocam: Phenocam;
};

const PhenocamGallery: React.FC<PhenocamGalleryProps> = ({ phenocam }) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredImages, setFilteredImages] = useState<any>([]);
  const [heroImage, setHeroImage] = useState<string>(phenocam.images[0].path);
  const [currentPhotoDate, setCurrentPhotoDate] = useState<Date | undefined>(
      undefined,
  );
  const [excludeDates, setExcludeDates] = useState<Date[]>([]);
  const [lastAvailableDate, setLastAvailableDate] = useState<
      string | undefined
  >();
  const [twoWeeksAgo, setTwoWeeksAgo] = useState<Date | null>();
  const [today, setToday] = useState<Date | null>();

  useEffect(() => {
    let since = subDays(new Date(), 14);
    setToday(new Date());
    setTwoWeeksAgo(since);
    const dates = phenocam.images
        .map((image) => {
          return image.path.match(/\d{4}-\d{2}-\d{2}/)?.[0];
        })
        .filter((date) => date !== null) as string[];

    let uniq = dates.filter(function (item, pos) {
      return dates.indexOf(item) == pos;
    });
    setLastAvailableDate(uniq.reverse()[0]);
    let exclude: Date[] = [];
    for (let i = 0; i <= 14; i++) {
      const checkDate = addDays(since, i).toJSON().split("T")[0];
      if (!uniq.includes(checkDate)) {
        exclude.push(new Date(checkDate));
      }
    }
    setExcludeDates(exclude);
  }, [phenocam]);

  const handleDateChange = useCallback(
      (date: Date) => {
        const utc = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        setSelectedDate(utc);
        if (date) {
          const dateString = date.toJSON().split("T")[0];
          const newFilteredImages = phenocam.images.filter((image) =>
              image.path.includes(dateString),
          );
          setFilteredImages(newFilteredImages.reverse().slice(0, 20));
          if (newFilteredImages.length > 0) {
            setHeroImage(newFilteredImages[0].path);
            setCurrentPhotoDate(parseImageFilename(newFilteredImages[0].path));
          } else {
            setHeroImage("");
            setCurrentPhotoDate(undefined);
          }
        } else {
          setFilteredImages(phenocam.images.slice(0, 20));
          setHeroImage(phenocam.images[0].path);
          setCurrentPhotoDate(parseImageFilename(phenocam.images[0].path));
        }
      },
      [phenocam.images],
  );

  const handleHeroChange = (path: string) => {
    setHeroImage(path);
    setCurrentPhotoDate(parseImageFilename(path));
  };

  useEffect(() => {
    if (lastAvailableDate && loading) {
      handleDateChange(new Date(lastAvailableDate));
      setLoading(false);
    }
  }, [handleDateChange, lastAvailableDate, loading]);

  useEffect(() => {
    registerLocale('es', es);
    setDefaultLocale('es');
  }, []);

  return (
    <div className="container mx-auto flex flex-col md:flex-row">
      {/* Hero Image */}
      <div className="flex-1 my-4 md:my-0">
        <a id="hero" />
        <div className="hero-image">
          {heroImage ? (
            <Image
              src={PROXY_URL + heroImage}
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Hero"
              className="w-full h-auto rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full h-64 flex items-center justify-center bg-gray-200 rounded-lg shadow-lg">
              No image available for selected date
            </div>
          )}
        </div>
      </div>

      {/* Sidebar for Image Grid */}
      <div className="w-full md:w-1/3 my-4 md:ml-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {phenocam.metadata.sitio}
        </h2>
        <div className="filter-toolbar mb-4 flex items-center">
          <DatePicker
              selected={selectedDate}
              withPortal={true}
              onChange={handleDateChange}
              className="p-2 border border-gray-300 rounded-md cursor-pointer"
              placeholderText="Seleccione fecha"
              locale={'es'}
              minDate={twoWeeksAgo}
              maxDate={today}
              excludeDates={excludeDates}
              value={selectedDate?.toLocaleDateString('es') + ' ' +  currentPhotoDate?.toLocaleTimeString()}
          />
        </div>

        {/* Image Grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
          {filteredImages.map((image: { path: string }, index: number) => (
              <div
                  key={index}
                  className="cursor-pointer"
                  onClick={() => handleHeroChange(image.path)}
              >
                <Image
                    src={PROXY_URL + image.path}
                    alt={`Thumbnail ${index}`}
                    width={0}
                    height={0}
                    style={{width: "100%", height: "auto"}}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-auto rounded-lg shadow-sm"
                />
              </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhenocamGallery;
