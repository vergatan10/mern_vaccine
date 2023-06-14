import { Box, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

const PageHeader = (props) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "1rem",
      }}
    >
      <Stack>
        <Typography variant="h6">{props.title}</Typography>
      </Stack>
      {props.rightContent}
    </Box>
  );
};

PageHeader.propTypes = {
  title: PropTypes.string,
  rightComponent: PropTypes.node,
};

export default PageHeader;
