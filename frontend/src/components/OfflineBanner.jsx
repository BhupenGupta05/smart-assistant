export default function OfflineBanner({ message }) {
  return (
    <div className="
      fixed top-0 left-0 right-0 z-[9999]
      bg-yellow-100 text-yellow-900
      text-xs md:text-sm px-2 py-1
      flex items-center justify-center
    ">
      {message}
    </div>
  );
}
