"use client";
import Card from "@/components/Card";
import Navbar from "@/components/Navbar";
import PhenocamGallery from "@/components/PhenocamGallery";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PROXY_URL } from "@/app/constants";

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
        <img
          src="https://www.pucv.cl/uuaa/site/artic/20180320/imag/foto_0000002620180320170803/Isologo_texto_negro.png"
          className="responsive-img"
          width="250"
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
