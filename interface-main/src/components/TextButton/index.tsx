import { ReactNode } from "react";
import { useHistory } from "react-router-dom";
import { Typography } from "@mui/material";
import { openInNewWindow } from "utils";

export function ALink({ children, link }: { children: ReactNode; link?: string }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      style={{ textDecoration: "underline", textDecorationColor: "#8492c4" }}
    >
      <Typography
        color="text.secondary"
        sx={{
          cursor: "pointer",
          userSelect: "none",
        }}
        component="span"
      >
        {children}
      </Typography>
    </a>
  );
}

export default function TextButton({
  children,
  onClick = () => {},
  disabled,
  link,
  to,
  sx,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  link?: string;
  to?: string;
  sx?: any;
}) {
  const history = useHistory();

  const handleClick = () => {
    if (link) {
      openInNewWindow(link, "text-button-open-new-window");
      return;
    }

    if (to) {
      history.push(to);
      return;
    }

    if (onClick) onClick();
  };

  return (
    <Typography
      color="secondary"
      sx={{
        cursor: "pointer",
        userSelect: "none",
        "&:hover": {
          textDecoration: "underline",
        },
        "& +.custom-text-button": {
          marginLeft: "18px",
        },
        ...(sx ?? {}),
      }}
      className="custom-text-button"
      component="span"
      onClick={() => {
        if (Boolean(disabled)) return;
        handleClick();
      }}
    >
      {children}
    </Typography>
  );
}
