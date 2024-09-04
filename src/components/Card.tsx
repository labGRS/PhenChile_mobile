"use client";
import React from "react";
import Image from "next/image";
import {Phenocam} from "@/app/page";
import { useRouter } from "next/navigation";
import {PROXY_URL} from "@/app/constants";

export default function Card({ cam }: { cam: Phenocam }) {
  const router = useRouter();
  const extractDateTimeFromUrl = (
    url: string,
  ): { date: string; time: string } | null => {
    // Extract the filename from the URL
    const filename = url.split("/").pop();

    if (!filename) {
      return null;
    }

    // Use a regular expression to match the date and time in the filename
    const regex = /(\d{4}-\d{2}-\d{2})_(\d{2}-\d{2})/;
    const match = filename.match(regex);

    if (!match) {
      return null;
    }

    const [_, date, time] = match;

    // Format the time to use colon instead of dash
    const formattedTime = time.replace("-", ":");

    return { date, time: formattedTime };
  };

  const lastPhoto = extractDateTimeFromUrl(
    cam.images[cam.images.length - 1].path,
  );
  return (
    <div
      className="card w-96 bg-teal-50 cursor-pointer"
      onClick={() => router.push("/?cam=" + cam.key)}
    >
      <figure>
        <Image
          src={PROXY_URL + cam.images[cam.images.length - 1].path}
          alt={cam.metadata.sitio}
          width={400}
          height={50}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title shadow-teal-50">{cam.name}</h2>
        {cam.metadata.sitio}, {cam.metadata.region}
        <br />
        {cam.metadata.vegetacion}
        <br />
        Última foto: {lastPhoto?.date} {lastPhoto?.time} hrs.
      </div>
    </div>
  );
}
