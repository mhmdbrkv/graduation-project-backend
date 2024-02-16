const asyncHandler = require("express-async-handler");
const ApiError = require("../utils/apiError");
const ApiFeatures = require("../utils/apiFeatures");
// const ApiFeatures = require("../utils/apiFeatures");

exports.deleteOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const document = await Model.findByIdAndDelete(id);
    if (!document) {
      return next(new ApiError(`No document for this id ${id}`, 404));
    }
    res.status(204).send();
  });

exports.updateOne = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!document) {
      return next(
        new ApiError(`No document for this id ${req.params.id}`, 404)
      );
    }
    res.status(201).json({ data: document });
  });

exports.createOne = (Model) =>
  asyncHandler(async (req, res) => {
    const newDocument = await Model.create(req.body);
    res.status(201).json({ data: newDocument });
  });

exports.getOne = (Model) =>
  asyncHandler(async (req, res) => {
    const document = await Model.findById(req.params.id);
    res.status(201).json({ data: document });
  });

exports.gettAll = (Model, modelName = "") =>
  asyncHandler(async (req, res) => {
    let filter = {};
    if (req.filter) filter = req.filte;

    // Build the query
    const numOfDocument = await Model.countDocuments();
    const apiFeatures = new ApiFeatures(Model.find(filter), req.query)
      .paginate(numOfDocument)
      .filter()
      .limitFields()
      .search(modelName)
      .sort();

    const { mongooseQuery, pagination } = apiFeatures;

    // Excute the query
    const courses = await mongooseQuery;

    res
      .status(200)
      .json({ results: courses.length, pagination, data: courses });
  });
