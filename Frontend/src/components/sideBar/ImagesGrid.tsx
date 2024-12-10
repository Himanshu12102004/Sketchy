let uploadedUrls = [
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810946/lunl7dqfxemjpocuzdy8.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810948/cwacnmnu8k0syywtpt9o.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810950/v54t2xverhhgef7akgqp.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810952/msmom5jgie8jedqzdygr.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810954/ffqpulup5np15obmqlvz.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810957/e8n8namt9kicly0snixb.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810960/x7x9qwifwh5mdaxcqb2i.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810964/qf5uounp3ckzfxbakqci.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810967/smf3f7dhx2nokqyqvxr3.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810970/bfnrunep2pvcwjuhmhil.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810973/ztelkysr4oyazpblpsmo.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810974/swkjxwcfxjdlda0lk5mt.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810977/gibpdmmgzaeavncndzvx.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810979/t4o5pggumkowecs39ycb.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810982/sdojws8uf1z4jhlccm4n.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810986/onfmrq3wvut15iii143r.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810989/b3pzoyyzelryswyuxmg6.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810991/iz0pe1fn6zghkowtqp1h.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810994/fk2i6zhdydzpsga875gg.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810996/cxm4e3wvrju7uowgpd8r.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733810999/mzpy8bfekaufcgv5fvht.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733811002/jxzvsf1dycyy4cp1qvog.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733811006/urxx2joy43i5fj1q1mlf.svg',
  'https://res.cloudinary.com/dni3bvxqo/image/upload/v1733811009/tzr4xdax7hvrtf5xf0qe.svg',
];
import { CaretLeft } from 'phosphor-react';
import React from 'react';
import SingleImage from './singleImage';
interface props {
  onImageSelect: (url: string) => void;
  toggleLibrary: () => void;
}
const ImagesGrid = (props: props) => {
  return (
    <div>
      <div className="flex">
        <CaretLeft
          size={32}
          className="cursor-pointer mr-3"
          onClick={props.toggleLibrary}
        ></CaretLeft>
        <div className="text-lg text-gray-600 font-bold">
          Select a SVG to draw
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
        {uploadedUrls.map((url, index) => (
          <SingleImage
            key={index}
            url={url}
            index={index}
            onImageSelect={props.onImageSelect}
          ></SingleImage>
        ))}
      </div>
    </div>
  );
};

export default ImagesGrid;
