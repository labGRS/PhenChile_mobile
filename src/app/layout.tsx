import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Phenocam Chile en tiempo real",
  description: "Monitoreo fenológico nacional",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-theme="cupcake">
    <head>
        <link type="text/css" rel="stylesheet" href="https://www.pucv.cl/uuaa/css/v1/reset.css"/>
        <link type="text/css" rel="stylesheet" href="https://www.pucv.cl/uuaa/css/v1/global.css"/>
        <link type="text/css" rel="stylesheet" href="https://www.pucv.cl/uuaa/css/v1/superfish.css"/>
        <link type="text/css" rel="stylesheet" href="https://www.pucv.cl/uuaa/css/v1/unidad_academica.css"/>
    </head>
    <body className={inter.className}>
    <div className="md:container md:mx-auto pt-10">
        <Suspense>{children}</Suspense>
    </div>
    <footer id="footer">
        <div className="auxi">
            <div className="banner285">

            </div>

            <h2 className="titular-portada">
                <div className="table-responsive" data-responsive="yes">
                    <table style={{width: '100%', height: '189px'}} cellPadding="1" border={0}>
                        <tbody>
                        <tr style={{height: '189px'}}>
                            <td style={{height: '189px'}}>
                                <p style={{textAlign: 'center'}}>
                                    <Image
                                    alt={'Logos'}
                                    src={'/PhenChile_mobile/static/images/logos_1200_200.png'}
                                    width={1200}
                                    height={200}
                                    className="responsive-img" /></p>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </h2>
            <h2 className="titular-portada"><p style={{textAlign: 'center'}}><strong>Instituto de Geografía | Pontificia
                Universidad Católica de Valparaíso</strong></p></h2>

            <div className="txt-footer">
                <p>
                    <img style={{display: 'inline'}} src="https://www.pucv.cl/pucv/site/artic/20150603/imag/foto_0000000120150603180447.png"
                         id="foto_00000001" className="fotodrag" alt="Imagen foto_00000001"/> Avenida Brasil N°2241
                    Valparaíso,
                    Chile
                    <img style={{display: 'inline'}} src="https://www.pucv.cl/pucv/site/artic/20150603/imag/foto_0000000220150603180447.png"
                         id="foto_00000002" className="fotodrag" alt="Imagen foto_00000002"/> + 56 32 227 4090

                </p>
                <div className="separa"></div>
            </div>


            <div className="separa"></div>
        </div>
        <div className="separa"></div>
    </footer>
    </body>
    </html>
  );
}
