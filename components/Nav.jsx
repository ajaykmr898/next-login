import { useState, useEffect } from "react";

import { NavLink } from ".";
import { userService } from "services";

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
          <li className="nav-item">
            <a href="/">
              <i className="fa-fw fas fa-home nav-icon"></i>&nbsp; Home
            </a>
          </li>
          <li className="nav-item">
            <a href="/users">
              <i className="fa-fw fas fa-list nav-icon"></i>&nbsp; Tickets List
            </a>
          </li>
          <li className="nav-item">
            <a href="/upload">
              <i className="fa-fw fas fa-upload nav-icon"></i>&nbsp; Upload
            </a>
          </li>
          <li className="nav-item">
            <a onClick={userService.logout} href="#">
              <i className="nav-icon fas fa-fw fa-sign-out-alt"></i>&nbsp;
              Logout
            </a>
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
