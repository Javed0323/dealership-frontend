interface Props {
  openSidebar: () => void;
}

export default function Header({ openSidebar }: Props) {
  return (
    <header className="h-16 bg-white shadow flex items-center px-4">
      <button
        onClick={openSidebar}
        className="p-2 rounded-md hover:bg-gray-100 transition lg:hidden"
      >
        ☰
      </button>
      {/* 
      {logo && (
        <img src={logo} alt="Logo" className="h-10 w-auto object-contain" />
      )} */}
    </header>
  );
}
