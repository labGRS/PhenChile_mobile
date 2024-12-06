"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import PhenocamGallery from "@/components/PhenocamGallery";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROXY_URL } from "@/app/constants";
import Image from "next/image";

export type Phenocam = {
  key: string;
  name: string;
  images: [{ path: string }];
  metadata: {
    nombre: string;
    sitio: string;
    region: string;
    fecha: string;
    latitud: string;
    longitud: string;
    elevacion_msnm: string;
    vegetacion: string;
    lc_code: string;
    proyecto: string;
    inv_responsable: string;
  };
};

export default function Home(props: any) {
  const [camData, setCamData] = useState<Phenocam[]>([]);
  const [loadSingleCam, setLoadSingleCam] = useState<string | null>();
  const [singleCam, setSingleCam] = useState<Phenocam | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  const searchParams = useSearchParams();

  useEffect(() => {
    fetch(PROXY_URL, {
      cache: "no-cache",
    })
      .then((r) => r.json())
      .then((data) => {
        setCamData(data);
        setLoading(false);
      });
    setLoadSingleCam(searchParams.get("cam"));
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    setSingleCam(undefined);
    setLoadSingleCam(searchParams.get("cam"));
  }, [searchParams]);

  useEffect(() => {
    const cam = loadSingleCam
      ? camData.filter((c) => c.key === loadSingleCam)[0]
      : undefined;
    setSingleCam(cam);
    setLoading(false);
  }, [camData, loadSingleCam]);

  return !loading ? (
    <>
      <p>
        <Image
          src={'/PhenChile_mobile/static/images/pucv.png'}
          className="responsive-img"
          alt={'Logo PUCV'}
          width={250}
          height={250}
          style={{
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
            marginBottom: '2rem'
          }}
        />
      </p>
      <Navbar data={camData} />
      {singleCam && <PhenocamGallery phenocam={singleCam} />}
      {!singleCam && (
        <div
          className={
            "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
          }
        >
          {camData.map((cam) => (
            <Card key={cam.key} cam={cam} />
          ))}
        </div>
      )}
    </>
  ) : (
    <span className="loading loading-bars loading-lg"></span>
  );
}
