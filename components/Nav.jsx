import { useState, useEffect } from "react";
import getConfig from "next/config";
import { userService } from "services";
import Link from "next/link";

export { Nav };

function Nav() {
  const [user, setUser] = useState(null);
  const pages = ["users", "tickets", "upload", "refund", "seller"];
  const titles = {
    users: "Agents List",
    tickets: "Tickets List",
    upload: "Upload Files",
    "tickets/add": "Add Ticket",
    "tickets/edit": "Edit Ticket",
    refund: "Refunds",
    seller: "Provider",
    "seller/transfer": "Transfer Amount",
  };
  const config = getConfig();
  let icon = "fa fa-plane";
  if (config?.publicRuntimeConfig?.isLocal) {
    icon = "fa fa-plane green";
  }

  useEffect(() => {
    const subscription = userService.user.subscribe((x) => setUser(x));
    return () => subscription.unsubscribe();
  }, []);

  function openClose(e) {
    e.preventDefault();
    document.querySelector("#wrapper").classList.toggle("toggled");
  }

  // only show nav when logged in
  if (!user) return null;

  function getPage() {
    let page = window?.location?.pathname || "";
    let parts = page.split("/");
    page = parts.length > 3 ? "/" + parts[1] + "/" + parts[2] : page;
    page = page.replace("/", "");
    return titles[page] || "Dashboard - " + userService.userValue?.firstName;
  }

  function getActiveMenu(curPage = null) {
    if (curPage) {
      return window?.location?.href.includes(curPage)
        ? "nav-item active"
        : "nav-item";
    }
    return pages.every((p) => !window.location.href.includes(p))
      ? "nav-item active"
      : "nav-item";
  }

  return (
    <div>
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <h2>
            <i className={icon}></i>
            &nbsp;&nbsp; Ticket Manager
          </h2>
        </div>

        <ul className="sidebar-nav">
          <li className={getActiveMenu()}>
            <Link href="/">
              <i className="fa-fw fas fa-line-chart nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Dashboard
            </Link>
          </li>
          <li className={getActiveMenu("users")}>
            <Link href="/users">
              <i className="fa-fw fas fa-users nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Agents
            </Link>
          </li>
          <li className={getActiveMenu("tickets")}>
            <Link href="/tickets">
              <i className="fa-fw fas fa-list nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Tickets
            </Link>
          </li>
          <li className={getActiveMenu("refund")}>
            <Link href="/refund">
              <i className="fa-fw fas fa-wallet nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Refunds
            </Link>
          </li>
          <li className={getActiveMenu("seller")}>
            <Link href="/seller">
              <i className="fa-fw fas fa-shop nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Provider
            </Link>
          </li>
          <li className={getActiveMenu("upload")}>
            <Link href="/upload">
              <i className="fa-fw fas fa-upload nav-icon"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Uploads
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={userService.logout} href="#">
              <i className="nav-icon fas fa-fw fa-sign-out-alt"></i>
              &nbsp;&nbsp;&nbsp;&nbsp; Logout
            </Link>
          </li>
        </ul>
      </aside>
      <div id="navbar-wrapper">
        <nav className="navbar navbar-inverse">
          <div className="container-fluid">
            <div className="navbar-header">
              <a
                onClick={(e) => {
                  openClose(e);
                }}
                href="#"
                className="navbar-brand"
                id="sidebar-toggle"
              >
                <i className="fa fa-bars"></i>
              </a>
            </div>
            <div style={{ margin: "auto" }}>{getPage()}</div>
          </div>
        </nav>
      </div>
    </div>
  );
}
