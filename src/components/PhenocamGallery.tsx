"use client";

import React, { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays, subDays } from "date-fns";
import { Phenocam } from "@/app/page";
import Image from "next/image";
import { router } from "next/client";

type PhenocamGalleryProps = {
  phenocam: Phenocam;
};

const PhenocamGallery: React.FC<PhenocamGalleryProps> = ({ phenocam }) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filteredImages, setFilteredImages] = useState<any>(phenocam.images);
  const [heroImage, setHeroImage] = useState<string>(phenocam.images[0].path);
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
    //setAvailableDates(uniq.map((d) => new Date(d)));
    let exclude: Date[] = [];
    // loop since starting date and create exclude dates that don't have images
    for (let i = 0; i <= 14; i++) {
      const checkDate = addDays(since, i).toISOString().split("T")[0];
      if (!uniq.includes(checkDate)) {
        exclude.push(new Date(checkDate));
      }
    }
    setExcludeDates(exclude);
  }, [phenocam]);

  const handleDateChange = useCallback(
    (date: Date | null) => {
      setSelectedDate(date);
      if (date) {
        const dateString = date.toISOString().split("T")[0]; // Format date to YYYY-MM-DD
        const newFilteredImages = phenocam.images.filter((image) =>
          image.path.includes(dateString),
        );
        setFilteredImages(newFilteredImages.reverse());
        if (newFilteredImages.length > 0) {
          setHeroImage(newFilteredImages[0].path);
        } else {
          setHeroImage("");
        }
      } else {
        setFilteredImages(phenocam.images);
        setHeroImage(phenocam.images[0].path);
      }
    },
    [phenocam.images],
  );

  useEffect(() => {
    if (lastAvailableDate && loading) {
      handleDateChange(new Date(lastAvailableDate));
      setLoading(false);
    }
  }, [handleDateChange, lastAvailableDate, loading]);

  return (
    <div className="container mx-auto">
      {/* Filter Toolbar */}
      <div className="filter-toolbar my-4">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="p-2 border border-gray-300 rounded-md"
          placeholderText="Seleccione fecha"
          minDate={twoWeeksAgo}
          maxDate={today}
          excludeDates={excludeDates}
        />
      </div>

      {/* Hero Image */}
      <a id="hero" />
      <div className="hero-image my-4">
        {heroImage ? (
          <Image
            src={heroImage}
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

      {/* Image Grid */}
      <div className="grid sm:grid-cols-4 md:grid-cols-8 gap-8">
        {filteredImages.map((image: { path: string }, index: number) => (
          <div
            key={index}
            className="cursor-pointer"
            onClick={() => setHeroImage(image.path)}
          >
            <Image
              src={image.path}
              alt={`Thumbnail ${index}`}
              width={0}
              height={0}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="w-full h-auto rounded-lg shadow-sm"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PhenocamGallery;
