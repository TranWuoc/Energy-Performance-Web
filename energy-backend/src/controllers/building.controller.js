const mongoose = require("mongoose");
const buildingService = require("../services/building.service");
const { getIO } = require("../socket");

async function createBuilding(req, res, next) {
      try {
            const building = await buildingService.createBuilding(req.body);

            const created = building.building;
            const payload = {
                  buildingId: created?.buildingId,
                  creatorName: created?.user?.fullName || "",
                  officeName: created?.generalInfo?.name || "",
                  createdAt: created?.createdAt
            };

            try {
                  const io = getIO();
                  io.to("admins").emit("admin:new-survey", payload);
            } catch (e) {
                  console.warn("Socket emit failed:", e?.message || e);
            }
            return res.status(201).json({
                  buildingId: building.building.buildingId,
                  data: building
            });
      } catch (err) {
            next(err);
      }
}

async function getAllBuildings(req, res, next) {
      try {
            const buildings = await buildingService.listBuildings();
            return res.json({
                  total: buildings.length,
                  data: buildings
            });
      } catch (err) {
            next(err);
      }
}

async function getBuildingById(req, res, next) {
      try {
            const { buildingId } = req.params;
            const building = await buildingService.getBuildingDetail(buildingId);
            return res.json(building);
      } catch (err) {
            next(err);
      }
}

async function getDetailBuilding(req, res, next) {
      try {
            const { buildingId } = req.params;
            const building = await buildingService.getBuildingDetail(buildingId);
            return res.json(building);
      } catch (err) {
            next(err);
      }
}

async function updateBuilding(req, res, next) {
      try {
            const { buildingId } = req.params;
            const updated = await buildingService.updateBuilding(buildingId, req.body);
            return res.json(updated);
      } catch (err) {
            next(err);
      }
}

async function deleteBuilding(req, res, next) {
      try {
            const { buildingId } = req.params;
            const result = await buildingService.removeBuilding(buildingId);
            return res.json(result);
      } catch (err) {
            next(err);
      }
}

module.exports = {
      createBuilding,
      getBuildingById,
      getDetailBuilding,
      getAllBuildings,
      updateBuilding,
      deleteBuilding
};
