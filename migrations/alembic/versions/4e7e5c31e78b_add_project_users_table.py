"""add project_users table

Revision ID: 4e7e5c31e78b
Revises: 18aeaffced61
Create Date: 2018-01-10 16:21:48.357880

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '4e7e5c31e78b'
down_revision = '18aeaffced61'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE projects_users (
            user_id UUID REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
            project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
            role TEXT NOT NULL,
            CONSTRAINT projects_users_pkey PRIMARY KEY (user_id, project_id)
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE projects_users;
    """)
