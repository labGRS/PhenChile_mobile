"use client";
import React from "react";
import Image from "next/image";
import { Phenocam } from "@/app/page";
import { router } from "next/client";
import { useRouter } from "next/navigation";

export default function FeatureImage({ cam }: { cam: Phenocam }) {
  return (
    <div className="grid grid-flow-col grid-rows-2 grid-cols-3 gap-8">
      <div className="card-body">
        <figure>
          <Image src={cam.images[0].path} alt="Cerro La Campana" />
        </figure>
        <h2 className="card-title shadow-teal-50">{cam.name}</h2>
        <p>Cerro La Campana</p>
      </div>
    </div>
  );
}
