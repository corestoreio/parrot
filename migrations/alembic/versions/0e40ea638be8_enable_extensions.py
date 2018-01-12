"""enable extensions

Revision ID: 0e40ea638be8
Revises: 
Create Date: 2018-01-10 16:21:32.326728

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0e40ea638be8'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.execute("""
        CREATE EXTENSION IF NOT EXISTS hstore;
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    """)


def downgrade():
    pass
