import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  FormControl,
  TextField,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import moment from "moment";
import React from "react";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import CustomDialog from "./CustomDialog";
import vaccineLotApi from "../api/vaccineLotApi";
import { DeleteOutlineTwoTone } from "@mui/icons-material";

const VaccineLots = ({ vaccine, onLotAdded, onLotDeleted, onLotUpdated }) => {
  const [pageSize, setPageSize] = useState(5);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [onSubmit, setOnSubmit] = useState(false);
  const [lotNumber, setLotNumber] = useState("");
  const [lotNumberErr, setLotNumberErr] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [quantityErr, setQuantityErr] = useState(false);
  const [onDelete, setOnDelete] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [onUpdate, setOnUpdate] = useState(false);
  const [selectedLot, setSelectedLot] = useState();

  const tableHeader = [
    {
      field: "name",
      headerName: "Lot number",
      width: 200,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 150,
      align: "right",
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    {
      field: "vaccinated",
      headerName: "Vacinated",
      width: 150,
      align: "right",
      renderCell: (params) => params.value.toLocaleString("de-DE"),
    },
    {
      field: "id",
      headerName: "Available",
      width: 150,
      align: "right",
      renderCell: (params) =>
        (params.row.quantity - params.row.vaccinated).toLocaleString("de-DE"),
    },
    {
      field: "createdAt",
      headerName: "Time",
      flex: 1,
      renderCell: (params) => moment(params.value).format("DD-MM-YYY HH:mm:ss"),
    },
    {
      field: "_id",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <>
          <LoadingButton
            color="error"
            disableElevation
            startIcon={<DeleteOutlineOutlinedIcon />}
            loading={onDelete}
            onClick={() => deleteLot(params.row.id)}
          >
            Delete
          </LoadingButton>
          <Button
            color="info"
            startIcon={<ModeEditOutlineOutlinedIcon />}
            onClick={() => selectLot(params.row)}
          >
            Edit
          </Button>
        </>
      ),
    },
  ];

  const createLot = async () => {
    if (onSubmit) return;
    const err = [!lotNumber, !quantity];
    setLotNumberErr(!lotNumber);
    setQuantityErr(!quantity);
    if (!err.every((e) => !e)) return;
    setOnSubmit(true);
    const params = {
      vaccineId: vaccine.id,
      name: lotNumber,
      quantity,
    };
    try {
      const res = await vaccineLotApi.create(params);
      setQuantity("");
      setLotNumber("");
      setShowAddDialog(false);
      onLotAdded();
    } catch (err) {
      setOnSubmit(false);
      console.log(err);
    } finally {
      setOnSubmit(false);
    }
  };

  const deleteLot = async (lotId) => {
    if (onDelete) return;
    try {
      await vaccineLotApi.delete(lotId);
      onLotDeleted();
    } catch (err) {
      console.log(err);
    } finally {
      setOnDelete(false);
    }
  };

  const selectLot = (lot) => {
    setLotNumber(lot.name);
    setQuantity(lot.quantity);
    setSelectedLot(lot);
    setShowUpdateDialog(true);
  };

  const hideUpdateDialog = () => {
    setLotNumber("");
    setQuantity("");
    setSelectedLot(undefined);
    setShowUpdateDialog(false);
  };

  const updateLot = async () => {
    if (onUpdate) return;
    const err = [!lotNumber, !quantity];
    setLotNumberErr(!lotNumber);
    setQuantityErr(!quantity);
    if (!err.every((e) => !e)) return;
    setOnUpdate(true);
    const params = {
      name: lotNumber,
      quantity,
    };
    try {
      await vaccineLotApi.update(selectedLot.id, params);
      setQuantity("");
      setLotNumber("");
      setShowUpdateDialog(false);
      onLotUpdated();
    } catch (err) {
      console.log(err);
    } finally {
      setOnUpdate(false);
    }
  };

  return (
    <>
      <Card elevation={0}>
        <CardHeader
          title={<Typography variant="h6">Lots information</Typography>}
          action={
            <Button
              variant="contained"
              disableElevation
              onClick={() => setShowAddDialog(true)}
            >
              Add Lot
            </Button>
          }
        />
        <CardContent>
          <DataGrid
            autoHeight
            rows={vaccine.vaccineLots}
            columns={tableHeader}
            pageSize={pageSize}
            rowsPerPageOptions={[5, 10, 50]}
            onPageSizeChange={(size) => setPageSize(size)}
            density="comfortable"
            showCellRightBorder
            showColumnRightBorder
            disableSelectionOnClick
          />
        </CardContent>
      </Card>
      <CustomDialog
        open={showAddDialog}
        title="Add vaccine lot"
        content={
          <Box sx={{ width: "400px" }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Lot number"
                variant="outlined"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                error={lotNumberErr}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Quantity"
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={quantityErr}
              />
            </FormControl>
          </Box>
        }
        actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            width="100%"
          >
            <Button
              variant="text"
              onClick={() => setShowAddDialog(false)}
              disabled={onSubmit}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              disableElevation
              loading={onSubmit}
              onClick={createLot}
            >
              Save
            </LoadingButton>
          </Box>
        }
      />
      <CustomDialog
        open={showUpdateDialog}
        title="Update vaccine lot"
        content={
          <Box sx={{ width: "400px" }}>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Lot number"
                variant="outlined"
                value={lotNumber}
                onChange={(e) => setLotNumber(e.target.value)}
                error={lotNumberErr}
              />
            </FormControl>
            <FormControl fullWidth margin="normal">
              <TextField
                label="Quantity"
                variant="outlined"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                error={quantityErr}
              />
            </FormControl>
          </Box>
        }
        actions={
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
            }}
            width="100%"
          >
            <Button
              variant="text"
              onClick={hideUpdateDialog}
              disabled={onUpdate}
            >
              Cancel
            </Button>
            <LoadingButton
              variant="contained"
              disableElevation
              loading={onUpdate}
              onClick={updateLot}
            >
              Update
            </LoadingButton>
          </Box>
        }
      />
    </>
  );
};

export default VaccineLots;
