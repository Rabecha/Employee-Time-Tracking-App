import yaml
import re

INPUT_FILE = .github/workflows/docker-publish.yml
OUTPUT_FILE = INPUT_FILE

def to_lowercase_image(image_name: str) -> str:
    parts = image_name.split(:)
    repo = parts[0].lower()
    tag = parts[1] if len(parts) > 1 else 
    return f{repo}:{tag} if tag else repo

def fix_docker_image_names():
    try:
        with open(INPUT_FILE, r) as f:
            data = yaml.safe_load(f)

        jobs = data.get(jobs, {})
        for job in jobs.values():
            steps = job.get(steps, [])
            for step in steps:
                if with in step:
                    with_args = step[with]
                    for key, value in with_args.items():
                        if isinstance(value, str) and image in key:
                            fixed = to_lowercase_image(value)
                            with_args[key] = fixed
                            print(fFixed
