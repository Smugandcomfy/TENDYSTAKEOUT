import { useCallback, useContext } from "react";
import { Typography, TypographyProps } from "@mui/material";
import { Override } from "utils/sdk/index";
import HeaderContext from "./headerContext";
import { SortDirection } from "./types";
import { Theme } from "@mui/material/styles";
import { useTheme } from "@mui/styles";
import { UpArrow, DownArrow } from "components/Arrow";

export type HeaderCellProps = Override<
  TypographyProps,
  {
    isSort?: boolean;
    sortField?: string;
    field: string;
    sortDirection?: SortDirection;
  }
>;

export default function HeaderCell({ isSort, field, ...props }: HeaderCellProps) {
  const theme = useTheme() as Theme;

  const { sortChange, sortField, sortDirection } = useContext(HeaderContext);

  const arrow = useCallback(
    (field: string) => {
      return sortField === field ? sortDirection === SortDirection.ASC ? <UpArrow /> : <DownArrow /> : "";
    },
    [sortDirection, sortField]
  );

  const handleClick = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    if (isSort) {
      sortChange(field, sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC);
    }
    if (props.onClick) props.onClick(event);
  };

  return (
    <Typography
      {...props}
      sx={{
        cursor: "pointer",
        userSelect: "none",
        color: theme.colors.darkPrimary400,
        display: "flex",
        alignItems: "center",
        "@media screen and (max-width: 600px)": {
          fontSize: "12px",
        },
        ...(props.sx ?? {}),
      }}
      onClick={handleClick}
    >
      {props.children} {arrow(field)}
    </Typography>
  );
}
