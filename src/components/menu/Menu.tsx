import { Link } from "react-router-dom";
import "./menu.scss";

const menuData = [
  {
    id: 1,
    title: "main",
    listItems: [
      { id: 1, title: "Homepage", url: "/", icon: "home.svg" },
      { id: 2, title: "Profile", url: "/users/1", icon: "user.svg" },
    ],
  },
  {
    id: 2,
    title: "lists",
    listItems: [
      { id: 1, title: "Users", url: "/users", icon: "user.svg" },
      { id: 2, title: "Products", url: "/products", icon: "product.svg" },
      { id: 3, title: "Orders", url: "/orders", icon: "order.svg" },
      { id: 4, title: "Inventory", url: "/inventory", icon: "post.svg" },
    ],
  },
  // {
  //   id: 3,
  //   title: "general",
  //   listItems: [
  //     { id: 1, title: "Elements", url: "/", icon: "element.svg" },
  //     { id: 2, title: "Notes", url: "/", icon: "note.svg" },
  //     { id: 3, title: "Forms", url: "/", icon: "form.svg" },
  //     { id: 4, title: "Calendar", url: "/", icon: "calendar.svg" },
  //   ],
  // },
  {
    id: 4,
    title: "Maintenance",
    listItems: [
      { id: 1, title: "Settings", url: "/settings", icon: "setting.svg" },
      // { id: 2, title: "Backups", url: "/", icon: "backup.svg" },
    ],
  },
  {
    id: 5,
    title: "analytics",
    listItems: [
      { id: 1, title: "Charts", url: "/analytics", icon: "chart.svg" },
      // { id: 2, title: "Logs", url: "/", icon: "log.svg" },
    ],
  },
];

type Props = {
  onClose?: () => void;
};

const Menu = ({ onClose }: Props) => {
  return (
    <div className="menu">
      {menuData.map((item) => (
        <div className="item" key={item.id}>
          <span className="title">{item.title}</span>
          {item.listItems.map((listItem) => (
            <Link to={listItem.url} className="listItem" key={listItem.id} onClick={onClose}>
              <img src={listItem.icon} alt="" />
              <span className="listItemTitle">{listItem.title}</span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Menu;
