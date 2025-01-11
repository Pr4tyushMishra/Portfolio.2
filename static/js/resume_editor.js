// Debug logging function
function debugLog(message, data = null) {
    console.log(`DEBUG: ${message}`, data ? data : '');
}

// Simple, non-recursive error handling
function saveResume() {
    debugLog('Saving Resume');
    
    try {
        // Check for required elements
        const requiredElements = [
            'fullName', 'title', 'summary', 
            'experienceList', 'educationList', 'skillsList'
        ];
        
        const missingElements = requiredElements.filter(id => !document.getElementById(id));
        
        if (missingElements.length > 0) {
            console.error('Missing elements:', missingElements);
            alert('Some resume sections are not available. Please check the form.');
            return;
        }

        // Safely get personal info
        const getElementValue = (id) => {
            const el = document.getElementById(id);
            return el ? el.value : '';
        };

        const resumeData = {
            personalInfo: {
                name: getElementValue('fullName'),
                title: getElementValue('title'),
                summary: getElementValue('summary')
            },
            experience: Array.from(document.querySelectorAll('#experienceList > div')).map(exp => {
                const inputs = exp.querySelectorAll('input, textarea');
                return {
                    company: inputs[0] ? inputs[0].value : '',
                    position: inputs[1] ? inputs[1].value : '',
                    startDate: inputs[2] ? inputs[2].value : '',
                    endDate: inputs[3] ? inputs[3].value : '',
                    description: inputs[4] ? inputs[4].value : ''
                };
            }),
            education: Array.from(document.querySelectorAll('#educationList > div')).map(edu => {
                const inputs = edu.querySelectorAll('input');
                return {
                    institution: inputs[0] ? inputs[0].value : '',
                    degree: inputs[1] ? inputs[1].value : '',
                    startDate: inputs[2] ? inputs[2].value : '',
                    endDate: inputs[3] ? inputs[3].value : '',
                    gpa: inputs[4] ? inputs[4].value : ''
                };
            }),
            skills: Array.from(document.querySelectorAll('#skillsList > div')).map(skill => {
                const input = skill.querySelector('input');
                const select = skill.querySelector('select');
                return {
                    name: input ? input.value : '',
                    level: select ? select.value : ''
                };
            })
        };

        debugLog('Resume Data to Save:', resumeData);

        fetch('/api/save-resume', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(resumeData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert('Resume saved successfully!');
            } else {
                alert('Error saving resume: ' + (data.message || 'Unknown error'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error saving resume. Please try again.');
        });
    } catch (error) {
        console.error('Unexpected error in saveResume:', error);
        alert('An unexpected error occurred while saving the resume.');
    }
}

// Comprehensive Preview Update Function
function updatePreview() {
    console.log('DEBUG: Starting updatePreview()');
    
    // Get preview element with extensive logging
    const preview = document.getElementById('resumePreview');
    if (!preview) {
        console.error('ERROR: Preview element not found. Check your HTML.');
        return;
    }

    // Flexible function to get input value safely
    const getInputValue = (selectors, defaultValue = '') => {
        for (let selector of selectors) {
            const input = document.querySelector(selector);
            if (input && input.value.trim()) {
                console.log(`DEBUG: Found value for ${selector}:`, input.value);
                return input.value.trim();
            }
        }
        console.log(`DEBUG: No value found for selectors: ${selectors.join(', ')}`);
        return defaultValue;
    };

    // Personal Info - Expanded Selectors
    const firstName = getInputValue([
        '#firstName', 
        'input[name="firstName"]', 
        'input[placeholder="First Name"]'
    ], 'First');
    
    const lastName = getInputValue([
        '#lastName', 
        'input[name="lastName"]', 
        'input[placeholder="Last Name"]'
    ], 'Last');

    const name = firstName && lastName 
        ? `${firstName} ${lastName}` 
        : getInputValue([
            '#name', 
            'input[name="fullName"]', 
            'input[placeholder="Full Name"]'
        ], 'Your Name');

    const email = getInputValue([
        '#email', 
        'input[name="email"]', 
        'input[placeholder="Email Address"]',
        'input[type="email"]'
    ], 'email@example.com');

    const phone = getInputValue([
        '#phone', 
        'input[name="phone"]', 
        'input[placeholder="Phone Number"]',
        'input[type="tel"]'
    ], 'Phone');

    const location = getInputValue([
        '#address', 
        '#location', 
        'input[name="location"]', 
        'input[placeholder="City, Country"]'
    ], 'Location');

    const summary = getInputValue([
        '#summary', 
        'textarea[name="summary"]', 
        'textarea[placeholder="Professional Summary"]'
    ], 'Professional Summary');

    const professionalTitle = getInputValue([
        '#professionalTitle', 
        'input[name="professionalTitle"]', 
        'input[placeholder="Professional Title"]'
    ], 'Professional Title');

    console.log('DEBUG: Personal Info Gathered', { 
        name, 
        email, 
        phone, 
        location, 
        summary, 
        professionalTitle 
    });

    // Experience Preview
    const experiencePreview = getExperiencePreview();
    console.log('DEBUG: Experience Preview:', experiencePreview);
    
    // Education Preview
    const educationPreview = getEducationPreview();
    console.log('DEBUG: Education Preview:', educationPreview);
    
    // Skills Preview
    const skillsPreview = getSkillsPreview();
    console.log('DEBUG: Skills Preview:', skillsPreview);

    // Construct Full Preview HTML
    const previewHTML = `
        <div class="resume-preview p-8 bg-white shadow-lg">
            <div class="text-center mb-8">
                <h1 class="text-3xl font-bold text-gray-800">${name}</h1>
                ${professionalTitle ? `<h2 class="text-xl text-gray-600">${professionalTitle}</h2>` : ''}
                <p class="text-gray-600">${email} | ${phone} | ${location}</p>
            </div>

            ${summary ? `
            <div class="mb-6">
                <h3 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">Professional Summary</h3>
                <p class="text-gray-700">${summary}</p>
            </div>
            ` : ''}

            ${experiencePreview ? `
            <div class="mb-6">
                <h3 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">Professional Experience</h3>
                ${experiencePreview}
            </div>
            ` : ''}

            ${educationPreview ? `
            <div class="mb-6">
                <h3 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">Education</h3>
                ${educationPreview}
            </div>
            ` : ''}

            ${skillsPreview ? `
            <div>
                <h3 class="text-xl font-semibold border-b-2 border-gray-300 pb-2 mb-4">Skills</h3>
                ${skillsPreview}
            </div>
            ` : ''}
        </div>
    `;

    // Set innerHTML and log the result
    preview.innerHTML = previewHTML;
    console.log('DEBUG: Preview HTML set successfully');
}

// Flexible Experience Preview Function
function getExperiencePreview() {
    // Multiple selector approaches
    const experienceLists = [
        document.getElementById('experienceList'),
        document.getElementById('experienceContainer')
    ];

    let experiences = [];
    for (let list of experienceLists) {
        if (list) {
            // Use more specific selectors
            const experienceEntries = list.querySelectorAll('[data-section="experience"]');
            const classEntries = list.querySelectorAll('.experience-entry');
            const divEntries = list.querySelectorAll('div');

            if (experienceEntries.length > 0) {
                experiences = experienceEntries;
                break;
            } else if (classEntries.length > 0) {
                experiences = classEntries;
                break;
            } else if (divEntries.length > 0) {
                experiences = divEntries;
                break;
            }
        }
    }

    console.log(`DEBUG: Found ${experiences.length} experience entries`);
    
    if (experiences.length === 0) return '';

    return Array.from(experiences).map(exp => {
        // Multiple input selection strategies
        const companyInput = exp.querySelector('input[placeholder="Company Name"], input[placeholder="Company"]');
        const positionInput = exp.querySelector('input[placeholder="Position"], input[placeholder="Job Title"]');
        const startDateInput = exp.querySelector('input[placeholder="Start Date"]');
        const endDateInput = exp.querySelector('input[placeholder="End Date"]');
        const descriptionInput = exp.querySelector('textarea[placeholder="Description"], textarea[placeholder="Job Description"]');

        return `
            <div class="mb-4">
                <div class="flex justify-between">
                    <h4 class="font-semibold text-gray-800">${positionInput ? positionInput.value : 'Position'}</h4>
                    <span class="text-gray-600">${startDateInput ? startDateInput.value : 'Start Date'} - ${endDateInput ? endDateInput.value : 'End Date'}</span>
                </div>
                <p class="text-gray-700">${companyInput ? companyInput.value : 'Company Name'}</p>
                <p class="text-gray-600 mt-2">${descriptionInput ? descriptionInput.value : 'Description'}</p>
            </div>
        `;
    }).join('');
}

// Flexible Education Preview Function
function getEducationPreview() {
    // Multiple selector approaches
    const educationLists = [
        document.getElementById('educationList'),
        document.getElementById('educationContainer')
    ];

    let educations = [];
    for (let list of educationLists) {
        if (list) {
            // Use more specific selectors
            const educationEntries = list.querySelectorAll('[data-section="education"]');
            const classEntries = list.querySelectorAll('.education-entry');
            const divEntries = list.querySelectorAll('div');

            if (educationEntries.length > 0) {
                educations = educationEntries;
                break;
            } else if (classEntries.length > 0) {
                educations = classEntries;
                break;
            } else if (divEntries.length > 0) {
                educations = divEntries;
                break;
            }
        }
    }

    console.log(`DEBUG: Found ${educations.length} education entries`);
    
    if (educations.length === 0) return '';

    return Array.from(educations).map(edu => {
        // Multiple input selection strategies
        const institutionInput = edu.querySelector('input[placeholder="Institution"]');
        const degreeInput = edu.querySelector('input[placeholder="Degree"]');
        const startDateInput = edu.querySelector('input[placeholder="Start Date"], input[placeholder="Graduation Year"]');
        const endDateInput = edu.querySelector('input[placeholder="End Date"]');
        const gpaInput = edu.querySelector('input[placeholder="GPA"]');

        return `
            <div class="mb-4">
                <div class="flex justify-between">
                    <h4 class="font-semibold text-gray-800">${degreeInput ? degreeInput.value : 'Degree'}</h4>
                    <span class="text-gray-600">${startDateInput ? startDateInput.value : 'Start Date'} - ${endDateInput ? endDateInput.value : 'End Date'}</span>
                </div>
                <p class="text-gray-700">${institutionInput ? institutionInput.value : 'Institution'}</p>
                ${gpaInput && gpaInput.value ? `<p class="text-gray-600">GPA: ${gpaInput.value}</p>` : ''}
            </div>
        `;
    }).join('');
}

// Flexible Skills Preview Function
function getSkillsPreview() {
    // Multiple selector approaches
    const skillsLists = [
        document.getElementById('skillsList'),
        document.getElementById('skillsContainer')
    ];

    let skills = [];
    for (let list of skillsLists) {
        if (list) {
            // Use more specific selectors
            const skillEntries = list.querySelectorAll('[data-section="skill"]');
            const classEntries = list.querySelectorAll('.skill-entry');
            const divEntries = list.querySelectorAll('div');

            if (skillEntries.length > 0) {
                skills = skillEntries;
                break;
            } else if (classEntries.length > 0) {
                skills = classEntries;
                break;
            } else if (divEntries.length > 0) {
                skills = divEntries;
                break;
            }
        }
    }

    console.log(`DEBUG: Found ${skills.length} skill entries`);
    
    if (skills.length === 0) return '';

    return `
        <div class="flex flex-wrap gap-2">
            ${Array.from(skills).map(skill => {
                const input = skill.querySelector('input[placeholder="Skill Name"], input');
                const select = skill.querySelector('select');
                
                console.log('DEBUG: Skill Input:', input ? input.value : 'NO INPUT');
                console.log('DEBUG: Skill Level:', select ? select.value : 'NO SELECT');
                
                return `
                    <span class="bg-gray-200 px-3 py-1 rounded-full text-sm">
                        ${input ? input.value : 'Skill'} ${select ? `(${select.value})` : ''}
                    </span>
                `;
            }).join('')}
        </div>
    `;
}

// Comprehensive Event Listeners and Preview Update
document.addEventListener('DOMContentLoaded', function() {
    console.log('DEBUG: DOM Loaded, setting up comprehensive event listeners');

    // Comprehensive list of input selectors
    const inputSelectors = [
        // Personal Info
        '#name', '#firstName', '#lastName', 
        '#email', '#phone', '#address', 
        '#location', '#summary', 
        '#githubProfile', '#linkedinProfile',

        // Experience Inputs
        '#experienceList input', '#experienceList textarea',
        '#experienceContainer input', '#experienceContainer textarea',

        // Education Inputs
        '#educationList input', '#educationList textarea',
        '#educationContainer input', '#educationContainer textarea',

        // Skills Inputs
        '#skillsList input', '#skillsList select',
        '#skillsContainer input', '#skillsContainer select'
    ];

    // Add event listeners to all potential input sources
    inputSelectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
            // Log each element being bound
            console.log('DEBUG: Binding events to element', element);

            // Input event for text inputs and textareas
            element.addEventListener('input', function(event) {
                console.log('DEBUG: Input event triggered', {
                    selector: selector,
                    value: event.target.value,
                    type: event.target.type
                });
                updatePreview();
            });

            // Change event for select elements
            element.addEventListener('change', function(event) {
                console.log('DEBUG: Change event triggered', {
                    selector: selector,
                    value: event.target.value,
                    type: event.target.type
                });
                updatePreview();
            });
        });
    });

    // Mutation Observers for dynamic content
    const observeSections = [
        { id: 'experienceList', name: 'Experience' },
        { id: 'educationList', name: 'Education' },
        { id: 'skillsList', name: 'Skills' }
    ];

    observeSections.forEach(section => {
        const list = document.getElementById(section.id);
        if (list) {
            const observer = new MutationObserver((mutations) => {
                console.log(`DEBUG: Mutations detected in ${section.name} section`);
                mutations.forEach(mutation => {
                    console.log('Mutation type:', mutation.type);
                    if (mutation.type === 'childList') {
                        console.log('Added nodes:', mutation.addedNodes.length);
                        console.log('Removed nodes:', mutation.removedNodes.length);
                    }
                });
                updatePreview();
            });

            observer.observe(list, { 
                childList: true, 
                subtree: true, 
                characterData: true 
            });
        } else {
            console.warn(`DEBUG: ${section.name} list not found`);
        }
    });

    // Fallback: Periodic check for changes
    let lastPreviewContent = '';
    function periodicPreviewCheck() {
        const currentPreview = document.getElementById('resumePreview');
        if (currentPreview) {
            const currentContent = currentPreview.innerHTML;
            if (currentContent !== lastPreviewContent) {
                console.log('DEBUG: Preview content changed via periodic check');
                lastPreviewContent = currentContent;
            }
        }
        setTimeout(periodicPreviewCheck, 1000);
    }
    periodicPreviewCheck();

    // Initial preview
    console.log('DEBUG: Calling initial updatePreview()');
    updatePreview();
});

// Professional Template Add Functions
function addExperience() {
    const experienceList = document.getElementById('experienceList');
    const experienceItem = document.createElement('div');
    experienceItem.className = 'bg-gray-50 p-4 rounded relative';
    experienceItem.setAttribute('data-section', 'experience');
    experienceItem.innerHTML = `
        <div class="drag-handle cursor-move absolute top-2 right-2">⋮</div>
        <div class="space-y-2">
            <input type="text" placeholder="Company Name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <input type="text" placeholder="Position" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <div class="grid grid-cols-2 gap-2">
                <input type="month" placeholder="Start Date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <input type="month" placeholder="End Date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <textarea placeholder="Description" rows="3" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"></textarea>
            <button onclick="this.parentElement.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
        </div>
    `;
    experienceList.appendChild(experienceItem);
    updatePreview();
}

function addEducation() {
    const educationList = document.getElementById('educationList');
    const educationItem = document.createElement('div');
    educationItem.className = 'bg-gray-50 p-4 rounded relative';
    educationItem.setAttribute('data-section', 'education');
    educationItem.innerHTML = `
        <div class="drag-handle cursor-move absolute top-2 right-2">⋮</div>
        <div class="space-y-2">
            <input type="text" placeholder="Institution" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <input type="text" placeholder="Degree" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <div class="grid grid-cols-2 gap-2">
                <input type="month" placeholder="Start Date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <input type="month" placeholder="End Date" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            </div>
            <input type="text" placeholder="GPA" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <button onclick="this.parentElement.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
        </div>
    `;
    educationList.appendChild(educationItem);
    updatePreview();
}

function addSkill() {
    const skillsList = document.getElementById('skillsList');
    const skillItem = document.createElement('div');
    skillItem.className = 'bg-gray-50 p-4 rounded relative';
    skillItem.setAttribute('data-section', 'skill');
    skillItem.innerHTML = `
        <div class="drag-handle cursor-move absolute top-2 right-2">⋮</div>
        <div class="space-y-2">
            <input type="text" placeholder="Skill Name" class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
            <select class="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
            </select>
            <button onclick="this.parentElement.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm">Remove</button>
        </div>
    `;
    skillsList.appendChild(skillItem);
    updatePreview();
}

// Download Resume Function
async function downloadResume() {
    // Get the resume preview element
    const element = document.getElementById('resumePreview');
    
    // Configure the PDF options
    const opt = {
        margin: [0.75, 0.75, 0.75, 0.75], // margins in inches
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
            scale: 2,
            useCORS: true,
            letterRendering: true
        },
        jsPDF: { 
            unit: 'in', 
            format: 'a4', 
            orientation: 'portrait'
        }
    };

    try {
        // Create a clone of the element to modify for PDF
        const clonedElement = element.cloneNode(true);
        
        // Apply PDF-specific styling
        clonedElement.style.padding = '20px';
        clonedElement.style.maxWidth = '8.27in'; // A4 width
        clonedElement.style.margin = '0 auto';
        clonedElement.style.backgroundColor = 'white';
        
        // Create temporary container
        const container = document.createElement('div');
        container.appendChild(clonedElement);
        document.body.appendChild(container);
        
        // Generate PDF
        await html2pdf().set(opt).from(clonedElement).save();
        
        // Clean up
        document.body.removeChild(container);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Load existing resume data
function loadResumeData() {
    fetch('/api/get-resume')
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                const resumeData = data.data;
                
                // Load personal info
                document.getElementById('fullName').value = resumeData.personalInfo.name || '';
                document.getElementById('title').value = resumeData.personalInfo.title || '';
                document.getElementById('summary').value = resumeData.personalInfo.summary || '';

                // Load experience
                resumeData.experience.forEach(exp => {
                    addExperience();
                    const expDiv = document.querySelector('#experienceList > div:last-child');
                    const inputs = expDiv.querySelectorAll('input, textarea');
                    inputs[0].value = exp.company;
                    inputs[1].value = exp.position;
                    inputs[2].value = exp.startDate;
                    inputs[3].value = exp.endDate;
                    inputs[4].value = exp.description;
                });

                // Load education
                resumeData.education.forEach(edu => {
                    addEducation();
                    const eduDiv = document.querySelector('#educationList > div:last-child');
                    const inputs = eduDiv.querySelectorAll('input');
                    inputs[0].value = edu.institution;
                    inputs[1].value = edu.degree;
                    inputs[2].value = edu.startDate;
                    inputs[3].value = edu.endDate;
                    inputs[4].value = edu.gpa;
                });

                // Load skills
                resumeData.skills.forEach(skill => {
                    addSkill();
                    const skillDiv = document.querySelector('#skillsList > div:last-child');
                    skillDiv.querySelector('input').value = skill.name;
                    skillDiv.querySelector('select').value = skill.level;
                });

                updatePreview();
            }
        })
        .catch(error => console.error('Error loading resume data:', error));
}

// Modify event listeners
document.addEventListener('DOMContentLoaded', function() {
    debugLog('DOM Loaded, setting up event listeners');

    // Sortable initialization
    const sections = ['experienceList', 'educationList', 'skillsList'];
    sections.forEach(section => {
        const sectionEl = document.getElementById(section);
        if (sectionEl) {
            new Sortable(sectionEl, {
                animation: 150,
                handle: '.drag-handle'
            });
        } else {
            debugLog(`Section not found: ${section}`);
        }
    });

    // Preview event listeners
    document.addEventListener('input', updatePreview);
    document.addEventListener('change', updatePreview);

    // Button event listeners
    const saveButton = document.getElementById('saveResumeBtn');
    const downloadButton = document.getElementById('downloadResumeBtn');
    const previewButton = document.getElementById('previewResumeBtn');

    if (saveButton) {
        saveButton.addEventListener('click', saveResume);
    } else {
        debugLog('Save button not found');
    }

    if (downloadButton) {
        downloadButton.addEventListener('click', downloadResume);
    } else {
        debugLog('Download button not found');
    }

    if (previewButton) {
        previewButton.addEventListener('click', updatePreview);
    } else {
        debugLog('Preview button not found');
    }

    // Initial preview
    updatePreview();
    
    // Load existing resume data
    loadResumeData();
});

// Add these functions to match the HTML onclick events
function addExperienceEntry() {
    const experienceContainer = document.getElementById('experienceContainer');
    const experienceEntry = document.createElement('div');
    experienceEntry.className = 'experience-entry grid grid-cols-1 gap-4 mb-4';
    experienceEntry.setAttribute('data-section', 'experience');
    experienceEntry.innerHTML = `
        <input type="text" placeholder="Job Title" class="tech-input w-full px-3 py-2 text-gray-700">
        <input type="text" placeholder="Company" class="tech-input w-full px-3 py-2 text-gray-700">
        <div class="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Start Date" class="tech-input w-full px-3 py-2 text-gray-700">
            <input type="text" placeholder="End Date" class="tech-input w-full px-3 py-2 text-gray-700">
        </div>
        <textarea placeholder="Job Description" class="tech-input w-full px-3 py-2 text-gray-700 h-24"></textarea>
        <button onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm mt-2">Remove</button>
    `;
    experienceContainer.appendChild(experienceEntry);
    updatePreview();
}

function addEducationEntry() {
    const educationContainer = document.getElementById('educationContainer');
    const educationEntry = document.createElement('div');
    educationEntry.className = 'education-entry grid grid-cols-1 gap-4 mb-4';
    educationEntry.setAttribute('data-section', 'education');
    educationEntry.innerHTML = `
        <input type="text" placeholder="Degree" class="tech-input w-full px-3 py-2 text-gray-700">
        <input type="text" placeholder="Institution" class="tech-input w-full px-3 py-2 text-gray-700">
        <div class="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Graduation Year" class="tech-input w-full px-3 py-2 text-gray-700">
            <input type="text" placeholder="GPA" class="tech-input w-full px-3 py-2 text-gray-700">
        </div>
        <button onclick="this.parentElement.remove()" class="text-red-600 hover:text-red-800 text-sm mt-2">Remove</button>
    `;
    educationContainer.appendChild(educationEntry);
    updatePreview();
}

// Modify the skills section to work with the HTML
function addSkill() {
    const skillsContainer = document.getElementById('skillsContainer');
    const newSkillInput = document.getElementById('newSkill');
    
    if (!newSkillInput || !newSkillInput.value.trim()) {
        alert('Please enter a skill');
        return;
    }

    // Create a new skill chip
    const skillChip = document.createElement('span');
    skillChip.className = 'bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm mr-2 mb-2 inline-block';
    skillChip.innerHTML = `
        ${newSkillInput.value}
        <button onclick="this.parentElement.remove()" class="ml-2 text-red-600 hover:text-red-800">×</button>
    `;
    
    // Append the skill chip
    skillsContainer.insertBefore(skillChip, newSkillInput);
    
    // Clear the input
    newSkillInput.value = '';
    
    // Update preview
    updatePreview();
}

// Add event listeners to update preview dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Personal Info Inputs
    const personalInfoInputs = [
        'name', 'email', 'phone', 'address', 'summary',
        'firstName', 'lastName', 'location', 'githubProfile', 'linkedinProfile'
    ];

    personalInfoInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', updatePreview);
        }
    });

    // Experience, Education, and Skills Lists
    const experienceList = document.getElementById('experienceList');
    const educationList = document.getElementById('educationList');
    const skillsList = document.getElementById('skillsList');

    // Function to add mutation observer to a list
    const addListObserver = (list) => {
        if (!list) return;

        const observer = new MutationObserver(updatePreview);
        observer.observe(list, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
    };

    // Add observers to lists
    addListObserver(experienceList);
    addListObserver(educationList);
    addListObserver(skillsList);

    // Add event delegation for input changes in dynamic lists
    const addInputListener = (list) => {
        if (!list) return;

        list.addEventListener('input', function(event) {
            const input = event.target;
            if (input.tagName === 'INPUT' || input.tagName === 'TEXTAREA' || input.tagName === 'SELECT') {
                updatePreview();
            }
        });
    };

    addInputListener(experienceList);
    addInputListener(educationList);
    addInputListener(skillsList);

    // Skills Container special handling
    const skillsContainer = document.getElementById('skillsContainer');
    if (skillsContainer) {
        const skillObserver = new MutationObserver(updatePreview);
        skillObserver.observe(skillsContainer, { 
            childList: true, 
            subtree: true, 
            characterData: true 
        });
    }

    // Initial preview
    updatePreview();
});
