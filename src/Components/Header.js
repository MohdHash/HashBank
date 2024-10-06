import { useState } from "react";
import { styled } from "@mui/system"; // Import the styled utility
import { useLocation, useNavigate } from "react-router-dom";

// Define custom HTML components with sx prop using the styled utility
const AppBar = styled('div')(({ theme }) => ({
  backgroundColor: 'lightblue',
  color: 'black',
  padding: '10px',
}));

const Toolbar = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px',
});

const SearchInput = styled('input')({
  backgroundColor: 'white',
  borderRadius: '5px',
  width: '250px',
  padding: '5px',
  border: '1px solid lightgray',
});

const LoginButton = styled('button')({
  backgroundColor: 'blue',
  color: 'white',
  padding: '10px 20px',
  border: 'none',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'darkblue',
  },
});

const NavMenu = styled('div')({
  backgroundColor: 'white',
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  padding: '10px',
});

const NavItem = styled('div')({
  color: 'black',
  cursor: 'pointer',
  padding: '10px',
  '&:hover': {
    backgroundColor: 'lightblue',
  },
});

const DropdownMenu = styled('div')({
  position: 'absolute',
  top: '100%',
  left: 0,
  backgroundColor: 'white',
  border: '1px solid lightgray',
  zIndex: 1,
  padding: '10px',
});

const MenuItem = styled('div')({
  padding: '10px',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'lightblue',
  },
});

const Header = () => {
  const [anchorElement, setAnchorElement] = useState(null);
  const [menu, setMenu] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const handleOpenMenu = (event, menu) => {
    setAnchorElement(event.currentTarget);
    setMenu(menu);
  };

  const handleCloseMenu = () => {
    setAnchorElement(null);
    setMenu("");
  };

  const handleHomeClick = () => {
    navigate("/");
    handleCloseMenu();
  };

  const handleLoginBtnClick = () => {
    if (buttonText === "Sign in" ){
      navigate('/signIn');
    }else if(buttonText === 'Login'){
      navigate('/login');
    }
  }

  const buttonText = location.pathname === '/login' ? 'Sign in' : 'Login';

  return (
    <AppBar>
      <Toolbar>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src="" alt="" style={{ width: 50, marginRight: 20 }} />
          <SearchInput type="text" placeholder="Search" />
        </div>
        <LoginButton onClick={handleLoginBtnClick}>{buttonText}</LoginButton>
      </Toolbar>

      <NavMenu>
        {["Home", "Pay", "Borrow", "Invest", "Insure"].map((item) => (
          <NavItem
            key={item}
            onMouseEnter={(event) => handleOpenMenu(event, item)}
            onMouseLeave={handleCloseMenu}
            onClick={item === "Home" ? handleHomeClick : undefined}
          >
            {item}
            {menu !== "Home" && menu === item && (
              <DropdownMenu>
                <MenuItem>Option 1</MenuItem>
                <MenuItem>Option 2</MenuItem>
                <MenuItem>Option 3</MenuItem>
              </DropdownMenu>
            )}
          </NavItem>
        ))}
      </NavMenu>
    </AppBar>
  );
};

export default Header;
