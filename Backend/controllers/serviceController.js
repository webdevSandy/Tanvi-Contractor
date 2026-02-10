const Service = require('../models/Service');

// @desc    Create new service
// @route   POST /api/services
// @access  Private
exports.createService = async (req, res) => {
    const { name, title, description, points, rate } = req.body;
    let image = '';

    if (req.file) {
        image = req.file.path;
    }

    try {
        const service = new Service({
            name,
            title,
            description,
            points,
            image,
            rate
        });

        const createdService = await service.save();
        res.status(201).json(createdService);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getServices = async (req, res) => {
    try {
        const services = await Service.find().sort({ createdAt: -1 });
        res.json(services);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private
exports.updateService = async (req, res) => {
    console.log('Update Service Request Body:', req.body);
    console.log('Update Service Request File:', req.file);
    const { name, title, description, points, rate } = req.body;

    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            service.name = name || service.name;
            service.title = title || service.title;
            service.description = description || service.description;
            // service.points = points || service.points; 
            
            // Normalize points to array
            if (points) {
                 if (Array.isArray(points)) {
                     service.points = points;
                 } else {
                     service.points = [points];
                 }
            }
            
            service.rate = rate || service.rate;
            
            if (req.file) {
                service.image = req.file.path;
            } else if (req.body.image) {
                // If checking for existing image string passed in body
                 // service.image = req.body.image; 
                 // Note: Usually we don't send the image URL text back if we aren't changing it, 
                 // or we handle it if the user wants to manually set a URL.
                 // For now, let's allow it if sent.
                 service.image = req.body.image;
            }

            const updatedService = await service.save();
            res.json(updatedService);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        console.error('updateService error:', error);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteService = async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id);
        if (!service) return res.status(404).json({ message: 'Service not found' });
        res.json({ message: 'Service removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
