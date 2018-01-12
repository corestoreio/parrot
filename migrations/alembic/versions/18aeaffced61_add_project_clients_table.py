"""add project_clients table

Revision ID: 18aeaffced61
Revises: d9bebbe4439b
Create Date: 2018-01-10 16:21:45.300261

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '18aeaffced61'
down_revision = 'd9bebbe4439b'
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE TABLE project_clients (
            client_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            name TEXT NOT NULL,
            secret TEXT NOT NULL,
            project_id UUID REFERENCES projects (id) ON UPDATE CASCADE ON DELETE CASCADE,
            UNIQUE (name, project_id)
        );
    """)


def downgrade():
    op.execute("""
        DROP TABLE project_clients;
    """)
