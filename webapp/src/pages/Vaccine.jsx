import { Box, Button, FormControl, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import { useEffect, useState } from "react";
import vaccineApi from "../api/vaccineApi";
import { CustomDialog, PageHeader } from "../components";
import { Link } from "react-router-dom";
import { LoadingButton } from "@mui/lab";

const Vaccine = () => {
  const [vaccineList, setVaccineList] = useState([]);
  const [pageSize, setPageSize] = useState(9);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    const getVaccine = async () => {
      try {
        const res = await vaccineApi.getAll();
        setVaccineList(res);
      } catch (err) {
        console.log(err);
      }
    };
    getVaccine();
  }, []);

  const tableHeader = [
    {
      field: "name",
      headerName: "Name",
      size: 400,
      flex: 1,
      renderCell: (params) => (
        <Button
          variant="text"
          component={Link}
          to={`/vaccine/${params.row.id}`}
        >
          {params.value}
        </Button>
      ),
    },
    {
      field: "quantity",
      headerName: "Quantity",
      align: "right",
      width: 170,
      renderCell: (params) => params.value?.toLocaleString("de-DE"),
    },
    {
      field: "vaccinated",
      headerName: "Vaccinated",
      align: "right",
      width: 170,
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    {
      field: "id",
      headerName: "Available",
      align: "right",
      width: 170,
      renderCell: (params) =>
        (params.row.quantity - params.row.vaccinated).toLocaleString("de-DE"),
    },
    {
      field: "vaccineLots",
      headerName: "Lots",
      width: 170,
      renderCell: (params) => params.value.length,
    },
    {
      field: "createdAt",
      headerName: "Created at",
      width: 170,
      flex: 1,
      renderCell: (params) => moment(params.value).format("DD-MM-YYY HH:mm:ss"),
    },
  ];

  const onCreateSuccess = (newVaccine) => {
    console.log(newVaccine);
    setVaccineList([newVaccine, ...vaccineList]);
    setShowCreateModal(false);
  };

  return (
    <>
      <PageHeader
        title="Vaccine list"
        rightContent={
          <Button
            variant="contained"
            disableElevation
            onClick={() => setShowCreateModal(true)}
          >
            Create
          </Button>
        }
      />
      <Paper elevation={0}>
        <DataGrid
          autoHeight
          rows={vaccineList}
          columns={tableHeader}
          pageSize={pageSize}
          rowsPerPageOptions={[9, 50, 100]}
          onPageSizeChange={(size) => setPageSize(size)}
          density="comfortable"
          showColumnVerticalBorder
          showCellVerticalBorder
          disableRowSelectionOnClick
        />
      </Paper>
      <VaccineCreateModal
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={onCreateSuccess}
      />
    </>
  );
};

export default Vaccine;

const VaccineCreateModal = ({ show, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [nameErr, setNameErr] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);

  const createVaccine = async () => {
    if (onSubmit) return;
    if (!name || name.trim().length === 0) {
      setNameErr(true);
      return;
    }
    setNameErr(false);
    setOnSubmit(true);

    try {
      const res = await vaccineApi.create({ name });
      setName("");
      onSuccess(res);
    } catch (err) {
      console.log(err);
    } finally {
      setOnSubmit(false);
    }
  };
  return (
    <CustomDialog
      open={show}
      title="Add vaccine"
      content={
        <Box padding="5px 0">
          <FormControl>
            <TextField
              label="Vaccine name"
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={nameErr}
            />
          </FormControl>
        </Box>
      }
      actions={
        <Box
          width="100%"
          sx={{
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button variant="text" onClick={() => onClose()}>
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            onClick={createVaccine}
            loading={onSubmit}
          >
            Create
          </LoadingButton>
        </Box>
      }
    />
  );
};
