from sqlalchemy import inspect, text

from app.db.session import engine


def _table_exists(table_name: str) -> bool:
    return inspect(engine).has_table(table_name)


def _table_columns(table_name: str) -> set[str]:
    return {col["name"] for col in inspect(engine).get_columns(table_name)}


def _migrate_projects(conn) -> None:
    conn.execute(
        text(
            """
            CREATE TABLE projects_new (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL,
                description TEXT,
                short_description VARCHAR,
                technologies VARCHAR,
                image VARCHAR,
                github_url VARCHAR,
                live_url VARCHAR,
                is_featured BOOLEAN DEFAULT 0,
                status VARCHAR DEFAULT 'completed',
                display_order INTEGER DEFAULT 0,
                created_at DATETIME,
                updated_at DATETIME
            )
            """
        )
    )
    conn.execute(
        text(
            """
            INSERT INTO projects_new (
                id, name, description, technologies, image,
                github_url, live_url, is_featured, display_order, created_at, status
            )
            SELECT
                id, title, description, tech_stack, image_url,
                github_url, live_url, featured, "order", created_at, 'completed'
            FROM projects
            """
        )
    )
    conn.execute(text("DROP TABLE projects"))
    conn.execute(text("ALTER TABLE projects_new RENAME TO projects"))


def _migrate_skills(conn) -> None:
    conn.execute(
        text(
            """
            CREATE TABLE skills_new (
                id INTEGER PRIMARY KEY,
                name VARCHAR NOT NULL,
                category VARCHAR NOT NULL,
                proficiency INTEGER DEFAULT 80,
                icon VARCHAR,
                display_order INTEGER DEFAULT 0,
                created_at DATETIME,
                updated_at DATETIME
            )
            """
        )
    )
    conn.execute(
        text(
            """
            INSERT INTO skills_new (id, name, category, proficiency, icon, display_order)
            SELECT id, name, category, level, icon, "order"
            FROM skills
            """
        )
    )
    conn.execute(text("DROP TABLE skills"))
    conn.execute(text("ALTER TABLE skills_new RENAME TO skills"))


def migrate_schema() -> None:
    """Upgrade legacy SQLite schemas created before model renames."""
    with engine.begin() as conn:
        if _table_exists("projects"):
            columns = _table_columns("projects")
            if "title" in columns and "name" not in columns:
                _migrate_projects(conn)

        if _table_exists("skills"):
            columns = _table_columns("skills")
            if "level" in columns and "proficiency" not in columns:
                _migrate_skills(conn)

        for legacy_table in ("profile", "experience"):
            if _table_exists(legacy_table):
                conn.execute(text(f"DROP TABLE {legacy_table}"))
