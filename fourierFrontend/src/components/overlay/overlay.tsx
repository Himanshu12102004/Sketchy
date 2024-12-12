
export default function Overlay(props: {
  head: string;
  subHead: string;
  isErr: boolean;
}) {
  return (
    <div
      className="fixed h-full w-full inset-0 bg-black backdrop-blur-md flex flex-col items-center justify-center z-50"
      // style={{ display: window.innerWidth < 70 ? 'flex' : 'none' }}
    >
      {props.isErr ? (
        ''
      ) : (
        <img style={{ height: 150 }} src="loadGif.gif" alt="" />
      )}
      <div className=" mt-4 relative text-center text-white">
        <div className="text-xl font-mono mt-4">{props.head}</div>
        <div className="text-lg font-mono mt-2">{props.subHead}</div>
      </div>
    </div>
  );
}
