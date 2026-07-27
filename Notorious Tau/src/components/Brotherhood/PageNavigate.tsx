type PageNavigateProps = {
  onAdminClick: () => void;
  onAllBrosClick: () => void;
  location: string;
  userRole: string | null;
};

function PageNavigate({
  onAdminClick,
  onAllBrosClick,
  userRole,
  location,
}: PageNavigateProps) {
  return (
    <div className="flex-center flex-start w-100 gap-3 m-1 ps-1 z-5">
      {userRole === "admin" ? (
        <button className="return" onClick={onAdminClick}>
          Admin Page
        </button>
      ) : null}
      <button className="return" onClick={onAllBrosClick}>
        {location === "/Onlybros/AllBros" ? "Alumni Events" : "All Brothers"}
      </button>
    </div>
  );
}

export default PageNavigate;
