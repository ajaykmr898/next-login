import { useState, useEffect } from "react";

import { NavLink } from ".";
import { userService } from "services";
import Link from "next/link";

export { Nav };

function Nav() {
  const [user, setUser] = useState(null);

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

  function getActiveMenu(curPage) {
    if (curPage.length > 1) {
      return !window?.location?.href.includes(curPage[0]) &&
        !window.location.href.includes(curPage[1]) &&
        !window.location.href.includes(curPage[2])
        ? "nav-item active"
        : "nav-item";
    } else {
      return window?.location?.href.includes(curPage[0])
        ? "nav-item active"
        : "nav-item";
    }
  }

  return (
    <div>
      <aside id="sidebar-wrapper">
        <div className="sidebar-brand">
          <h2>
            <i className="fa fa-plane"></i>
            Ticket Manager
          </h2>
        </div>

        <ul className="sidebar-nav">
          <li className={getActiveMenu(["users", "tickets", "upload"])}>
            <Link href="/">
              <i className="fa-fw fas fa-home nav-icon"></i>&nbsp;&nbsp; Home
            </Link>
          </li>
          <li className={getActiveMenu(["users"])}>
            <Link href="/users">
              <i className="fa-fw fas fa-users nav-icon"></i>&nbsp;&nbsp; Agents
              List
            </Link>
          </li>
          <li className={getActiveMenu(["tickets"])}>
            <Link href="/tickets">
              <i className="fa-fw fas fa-list nav-icon"></i>&nbsp; Tickets List
            </Link>
          </li>
          <li className={getActiveMenu(["upload"])}>
            <Link href="/upload">
              <i className="fa-fw fas fa-upload nav-icon"></i>&nbsp; Upload
            </Link>
          </li>
          <li className="nav-item">
            <Link onClick={userService.logout} href="#">
              <i className="nav-icon fas fa-fw fa-sign-out-alt"></i>&nbsp;
              Logout
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
          </div>
        </nav>
      </div>
    </div>
  );
}
