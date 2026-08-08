import { ApiResponse } from "../utils/api-response.js";

const Name = (req, res) => {
    res.status(200).json(
        new ApiResponse(200, { message: "Hello" })
    );
    console.log("The code executed till here")
};

export { Name }; ``