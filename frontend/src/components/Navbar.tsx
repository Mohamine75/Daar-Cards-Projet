export const Navbar = () => {
  console.log('Navbar mounted');  // Pour voir si la navbar est rendue
  return (
    <nav className="navbar has-shadow" role="navigation" aria-label="main navigation" style={{ borderBottom: '2px solid #ccc' }}>
      <div className="navbar-brand">
        <a className="navbar-item" href="#">
          <img src="src/assets/logo_TCG.png" alt="Pokemon TCG Logo"
               style={{ width: '100px', height: '100px', objectFit: 'contain' }} />
        </a>
        <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false">
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item">Home</a>
          <a className="navbar-item">Documentation</a>
          <a className="navbar-item">Collections</a>
        </div>
      </div>
    </nav>
  );
};
